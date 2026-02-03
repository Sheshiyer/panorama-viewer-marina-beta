import { glob } from "glob";
import * as path from "path";
import * as fs from "fs/promises";

// Mapping configurations
const floorMapping: Record<string, string> = {
    "154m": "44f",
    "167m": "48f",
    "182m": "52f",
    "196m": "56f", // Corrected per review
    "210m": "60f", // Corrected per review
    "224m": "64f", // Corrected per review
    "238m": "68f", // Corrected per review
    "252m": "72f",
    "266m": "75f",
};

const timeMapping: Record<string, string> = {
    "Day View": "noon",
    "Morning View": "sunrise",
    "Evening View": "sunset",
    "Night View": "night",
};

const directionMapping: Record<string, string> = {
    "Central sea facing": "central-sea",
    "Sea facing": "central-sea",
    "Sea facing view": "central-sea",
    "central sea facing": "central-sea",
    "Marine line facing": "marine-line",
    "marine line facing": "marine-line",
    "Marine facing": "marine-line",
    "Stadium facing": "stadium",
    "stadium facing": "stadium",
    "Sea facing views": "central-sea",
    "Central Sea facing": "central-sea",
    "Central facing": "central-sea",
    "Marine line facin": "marine-line",
};

async function migrateAssets() {
    const sourceDir = path.resolve(".360-all");
    const targetDir = path.resolve("public/assets/panoramas-v2");

    console.log("🚀 Starting panorama migration...");
    console.log(`Source: ${sourceDir}`);
    console.log(`Target: ${targetDir}`);

    // Ensure target directory exists
    // await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(targetDir, { recursive: true });

    // Find all jpg files
    const files = await glob("**/*.jpg", { cwd: sourceDir });
    console.log(`\nFound ${files.length} files in source directory.`);

    if (files.length !== 108) {
        console.warn(`⚠️ Warning: Expected 108 files, found ${files.length}`);
    }

    let processedCount = 0;
    let errorCount = 0;

    for (const file of files) {
        // File structure is: {Time}/{Elevation}m/{Direction}/*.jpg
        const parts = file.split("/");
        if (parts.length < 4) {
            console.error(`❌ Invalid path structure: ${file}`);
            errorCount++;
            continue;
        }

        const [timeFolder, elevationFolder, directionFolder, filename] = parts;

        // Extract elevation number (remove 'm' if present used in mapping key)
        // The glob output might key separators differently on windows but we are on mac

        // Validate mappings
        const targetFloor = floorMapping[elevationFolder];
        const targetTime = timeMapping[timeFolder];
        const targetDirection = directionMapping[directionFolder];

        if (!targetFloor || !targetTime || !targetDirection) {
            console.error(`❌ Could not map path: ${file}`);
            console.error(`   - Floor (${elevationFolder}): ${targetFloor}`);
            console.error(`   - Time (${timeFolder}): ${targetTime}`);
            console.error(`   - Direction (${directionFolder}): ${targetDirection}`);
            errorCount++;
            continue;
        }

        // Construct target path: {floor}f/{time}/{direction}.jpg
        // Note: We rename the file to just "{direction}.jpg" or keep naming convention?
        // Current nomenclature uses {direction}.jpg as the filename inside the folder
        // e.g., 44f/noon/central-sea.jpg

        const targetPath = path.join(
            targetDir,
            targetFloor,
            targetTime,
            `${targetDirection}.jpg`
        );

        const targetDirForFile = path.dirname(targetPath);

        try {
            await fs.mkdir(targetDirForFile, { recursive: true });
            await fs.copyFile(path.join(sourceDir, file), targetPath);
            // console.log(`✅ Copied: ${targetFloor}/${targetTime}/${targetDirection}.jpg`);
            processedCount++;
        } catch (err) {
            console.error(`❌ Error copying ${file}:`, err);
            errorCount++;
        }
    }

    console.log("\nMigration Summary:");
    console.log(`✅ Processed: ${processedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📂 Output directory: ${targetDir}`);
}

migrateAssets().catch(console.error);
