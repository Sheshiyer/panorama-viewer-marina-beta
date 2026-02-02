#!/bin/bash
# Generate multi-resolution tiles for Pannellum from panorama images
# This creates a pyramid of tiles (like Google Maps) for fast progressive loading

set -e

echo "🎯 Pannellum Multi-Resolution Tile Generator"
echo "============================================="
echo ""

# Check if Pannellum generate.py is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is required but not found"
    echo "   Install Python 3: https://www.python.org/downloads/"
    exit 1
fi

# Configuration
PANNELLUM_GEN_SCRIPT="https://raw.githubusercontent.com/mpetroff/pannellum/master/utils/multires/generate.py"
SOURCE_DIR="public/assets/panoramas"
TILES_DIR="public/assets/tiles"
TEMP_GEN="/tmp/pannellum-generate.py"

# Download generate.py if not exists
if [ ! -f "$TEMP_GEN" ]; then
    echo "📥 Downloading Pannellum tile generator..."
    curl -sL "$PANNELLUM_GEN_SCRIPT" -o "$TEMP_GEN"
    echo "✅ Downloaded generator script"
    echo ""
fi

# Check if Pillow is installed
if ! python3 -c "import PIL" 2>/dev/null; then
    echo "⚠️  Warning: Pillow (PIL) not found. Installing..."
    pip3 install --break-system-packages Pillow
    echo ""
fi

# Create tiles directory
mkdir -p "$TILES_DIR"

# Avoid glob "no match" errors; empty iter ok
shopt -s nullglob 2>/dev/null || true

echo "🔍 Scanning for panorama images..."
echo ""

total=0
success=0
skipped=0

# Process each floor/time/direction combination
for floor_dir in "$SOURCE_DIR"/*/; do
    [ -d "$floor_dir" ] || continue
    floor=$(basename "$floor_dir")

    for time_dir in "$floor_dir"/*/; do
        [ -d "$time_dir" ] || continue
        time=$(basename "$time_dir")

        for img in "$time_dir"/*.jpg "$time_dir"/*.jpeg "$time_dir"/*.png "$time_dir"/*.JPG "$time_dir"/*.JPEG "$time_dir"/*.PNG; do
            [ -f "$img" ] || continue

            basename_img=$(basename "$img")
            name="${basename_img%.*}"
            output_dir="$TILES_DIR/$floor/$time/$name"

            # Skip if already generated
            if [ -d "$output_dir" ] && [ -f "$output_dir/config.json" ]; then
                echo "⏭️  Skipping (exists): $floor/$time/$name"
                skipped=$((skipped + 1))
                continue
            fi

            total=$((total + 1))
            file_size=$(du -h "$img" | cut -f1)

            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "🔄 Processing [$total]: $floor/$time/$name"
            echo "   Source: $file_size"
            echo "   Output: $output_dir"

            mkdir -p "$output_dir"

            # Generate tiles
            if python3 "$TEMP_GEN" \
                "$img" \
                "$output_dir" \
                --tilesize 512 \
                --cubesize 4096 \
                --quality 75 2>&1 | grep -v "^$"; then

                output_size=$(du -sh "$output_dir" 2>/dev/null | cut -f1)
                echo "   ✅ Success! Tiles: $output_size"
                success=$((success + 1))
            else
                echo "   ❌ Failed!"
                rm -rf "$output_dir"
            fi
            echo ""
        done
    done
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Tile Generation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Total processed: $total"
echo "   Success: $success"
echo "   Skipped (existing): $skipped"
echo "   Failed: $((total - success))"
echo ""

if [ $success -gt 0 ]; then
    total_size=$(du -sh "$TILES_DIR" 2>/dev/null | cut -f1 || echo "N/A")
    echo "📊 Total tiles size: $total_size"
    echo ""
    echo "📁 Tiles location: $TILES_DIR"
    echo ""
    echo "Next steps:"
    echo "1. Upload tiles to Cloudflare R2 (AWS CLI uses R2's S3-compatible API):"
    echo "   aws s3 sync $TILES_DIR s3://marina-one-panaroma-images/tiles/ \\"
    echo "     --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
    echo "   Configure AWS CLI with R2 credentials (see MULTIRES-SETUP.md)."
    echo "2. Update panoramaConfig.ts with multires basePaths (see MULTIRES-SETUP.md)"
    echo "3. Restart dev server to see fast loading!"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
