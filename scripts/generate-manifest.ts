import { glob } from "glob";
import * as path from "path";
import * as fs from "fs/promises";

// R2 Bucket URL
const R2_BASE_URL = "https://pub-68544d11dd1244a7b0f0bfd163eaffae.r2.dev";

async function generateManifest() {
    const sourceDir = path.resolve("public/assets/panoramas-v2");
    const manifestPath = path.resolve("lib/r2-manifest.panoramic.json");

    console.log("🚀 Generating manifest...");
    console.log(`Source: ${sourceDir}`);

    const files = await glob("**/*.jpg", { cwd: sourceDir });
    const manifest: Record<string, string> = {};

    for (const file of files) {
        // file is like: 44f/noon/central-sea.jpg
        const parts = file.split("/");
        if (parts.length < 3) continue;

        const [floor, time, filename] = parts;
        const direction = path.basename(filename, ".jpg");

        // Key format: "44f/noon/central-sea"
        const key = `${floor}/${time}/${direction}`;

        // URL format: R2_BASE_URL/key.jpg
        const url = `${R2_BASE_URL}/${file}`;

        manifest[key] = url;
    }

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Generated manifest with ${Object.keys(manifest).length} entries.`);
    console.log(`📂 Saved to: ${manifestPath}`);
}

generateManifest().catch(console.error);
