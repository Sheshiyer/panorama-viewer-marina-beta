
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import mime from "mime";  // You might need to install 'mime' or just hardcode jpeg
import * as glob from "glob";

// Use R2 credentials from environment
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// Use the V2 bucket name explicitly since .env has the old one
const bucketName = "marina-one-assets-360all";

if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error("❌ Error: Missing R2 credentials in environment variables.");
    process.exit(1);
}

const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const uploadDir = path.join(process.cwd(), "public/assets/panoramas-v2");

async function uploadFiles() {
    console.log(`🚀 Starting S3 SDK upload to bucket: ${bucketName}`);

    // Find all jpg files
    const files = await glob.glob("**/*.jpg", { cwd: uploadDir });

    console.log(`found ${files.length} files in ${uploadDir}`);

    for (const file of files) {
        const filePath = path.join(uploadDir, file);
        const fileContent = await fs.readFile(filePath);
        const key = file; // Relative path as key

        // Check if file exists first
        try {
            await s3.send(new HeadObjectCommand({
                Bucket: bucketName,
                Key: key,
            }));
            console.log(`⏭️  Skipping (already exists): ${key}`);
            continue;
        } catch (error: any) {
            // If not found, proceed to upload
            if (error.name !== "NotFound" && error.$metadata?.httpStatusCode !== 404) {
                console.warn(`⚠️  Unexpected error checking ${key}:`, error.message);
                // Optional: decide whether to throw or continue. We'll continue to try uploading.
            }
        }

        try {
            console.log(`⬆️  Uploading: ${key}`);
            await s3.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: fileContent,
                ContentType: "image/jpeg",
            }));
        } catch (error) {
            console.error(`❌ Failed to upload ${key}:`, error);
        }
    }

    console.log("\n🎉 Upload complete!");
    console.log("NOTE: You still need to enable Public Access in the Cloudflare Dashboard to get the URL.");
}

uploadFiles().catch(console.error);
