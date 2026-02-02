#!/usr/bin/env ts-node
/**
 * Validate which R2 images are proper panoramic (equirectangular) images
 * vs regular photos, using file metadata (size, dimensions, aspect ratio).
 *
 * Proper panoramic images should have:
 * - 2:1 aspect ratio (width:height)
 * - Large file size (typically 10MB+)
 * - Equirectangular projection
 *
 * This script:
 * 1. Fetches HEAD metadata from all R2 images in r2-manifest.generated.json
 * 2. Downloads a small sample to check dimensions
 * 3. Filters out non-panoramic images
 * 4. Outputs a clean manifest with only verified panoramic images
 *
 * Prerequisites:
 *   - lib/r2-manifest.generated.json exists (run npm run fetch-r2:urls first)
 *   - .env with R2 credentials (optional, for private buckets)
 *
 * Usage:
 *   npx ts-node scripts/validate-panoramic-images.ts
 *   npm run validate-panoramas
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// Minimum file size for panoramic images (in bytes)
const MIN_PANORAMIC_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_SAMPLE_DOWNLOAD = 100 * 1024; // Download first 100KB to check dimensions

interface ImageMetadata {
  url: string;
  key: string;
  size?: number;
  contentType?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  isPanoramic?: boolean;
  reason?: string;
}

// Fetch HEAD metadata (size, content-type) without downloading full image
async function fetchMetadata(url: string): Promise<Pick<ImageMetadata, 'size' | 'contentType'>> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      const size = res.headers['content-length'] ? parseInt(res.headers['content-length']) : undefined;
      const contentType = res.headers['content-type'];
      resolve({ size, contentType });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

// Download partial image data to check dimensions (first N bytes)
async function fetchImageDimensions(url: string, maxBytes: number = MAX_SAMPLE_DOWNLOAD): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      const chunks: Buffer[] = [];
      let totalSize = 0;

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
        totalSize += chunk.length;
        if (totalSize >= maxBytes) {
          req.destroy();
        }
      });

      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const dims = parseImageDimensions(buffer);
        resolve(dims);
      });

      res.on('error', () => resolve({}));
    });

    req.on('error', () => resolve({}));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({});
    });
  });
}

// Parse image dimensions from buffer (supports JPEG, PNG)
function parseImageDimensions(buffer: Buffer): { width?: number; height?: number } {
  try {
    // JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xFF) break;
        const marker = buffer[offset + 1];
        offset += 2;

        // SOF markers (Start of Frame)
        if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
          offset += 3; // Skip length + precision
          const height = buffer.readUInt16BE(offset);
          const width = buffer.readUInt16BE(offset + 2);
          return { width, height };
        }

        // Skip segment
        const segmentLength = buffer.readUInt16BE(offset);
        offset += segmentLength;
      }
    }

    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      // IHDR chunk starts at byte 16
      if (buffer.length >= 24) {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return {};
}

async function validateImage(key: string, url: string): Promise<ImageMetadata> {
  const meta: ImageMetadata = { url, key };

  try {
    // Step 1: Fetch HEAD metadata
    const { size, contentType } = await fetchMetadata(url);
    meta.size = size;
    meta.contentType = contentType;

    // Check 1: File size
    if (!size || size < MIN_PANORAMIC_SIZE) {
      meta.isPanoramic = false;
      meta.reason = `File too small (${size ? (size / 1024 / 1024).toFixed(2) : '?'}MB < 5MB)`;
      return meta;
    }

    // Step 2: Fetch dimensions
    const { width, height } = await fetchImageDimensions(url);
    meta.width = width;
    meta.height = height;

    if (width && height) {
      const aspectRatio = width / height;
      meta.aspectRatio = aspectRatio;

      // Check 2: Aspect ratio (2:1 for equirectangular, allow 10% tolerance)
      const isEquirect = aspectRatio >= 1.8 && aspectRatio <= 2.2;
      if (!isEquirect) {
        meta.isPanoramic = false;
        meta.reason = `Wrong aspect ratio (${aspectRatio.toFixed(2)}:1, expected 2:1)`;
        return meta;
      }

      meta.isPanoramic = true;
      meta.reason = `Valid panoramic (${width}x${height}, ${aspectRatio.toFixed(2)}:1, ${(size / 1024 / 1024).toFixed(2)}MB)`;
    } else {
      // Could not parse dimensions, assume panoramic if size is large enough
      meta.isPanoramic = true;
      meta.reason = `Large file (${(size / 1024 / 1024).toFixed(2)}MB), dimensions unknown`;
    }
  } catch (error) {
    meta.isPanoramic = false;
    meta.reason = `Error: ${error instanceof Error ? error.message : String(error)}`;
  }

  return meta;
}

async function main() {
  console.log('🔍 Validating panoramic images from R2 manifest...\n');

  // Load manifest
  const manifestPath = path.resolve(__dirname, '../lib/r2-manifest.generated.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ r2-manifest.generated.json not found. Run: npm run fetch-r2:urls');
    process.exit(1);
  }

  const manifest: Record<string, string> = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entries = Object.entries(manifest);
  console.log(`Found ${entries.length} images in manifest\n`);

  // Validate all images (with progress)
  const results: ImageMetadata[] = [];
  let completed = 0;

  for (const [key, url] of entries) {
    const meta = await validateImage(key, url);
    results.push(meta);
    completed++;

    // Progress indicator
    const percent = ((completed / entries.length) * 100).toFixed(0);
    const status = meta.isPanoramic ? '✅' : '❌';
    console.log(`[${percent}%] ${status} ${key}: ${meta.reason}`);
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  const panoramic = results.filter(r => r.isPanoramic);
  const nonPanoramic = results.filter(r => !r.isPanoramic);

  console.log(`\n📊 Summary:`);
  console.log(`   Total images: ${results.length}`);
  console.log(`   ✅ Panoramic: ${panoramic.length}`);
  console.log(`   ❌ Non-panoramic: ${nonPanoramic.length}`);

  // Output filtered manifest
  const filteredManifest: Record<string, string> = {};
  panoramic.forEach(m => {
    filteredManifest[m.key] = m.url;
  });

  const outputPath = path.resolve(__dirname, '../lib/r2-manifest.panoramic.json');
  fs.writeFileSync(outputPath, JSON.stringify(filteredManifest, null, 2), 'utf8');
  console.log(`\n✅ Filtered manifest saved to: lib/r2-manifest.panoramic.json`);

  // Output detailed report
  const reportPath = path.resolve(__dirname, '../lib/panoramic-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`📝 Detailed report saved to: lib/panoramic-validation-report.json`);

  if (nonPanoramic.length > 0) {
    console.log(`\n⚠️  Non-panoramic images detected:`);
    nonPanoramic.forEach(m => {
      console.log(`   - ${m.key}: ${m.reason}`);
    });
  }

  console.log('\n✨ Done! Use lib/r2-manifest.panoramic.json to update panoramaConfig.ts');
}

main().catch(console.error);
