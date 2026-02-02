#!/bin/bash
#
# Upload panorama files to Cloudflare R2 bucket
# Usage: ./scripts/upload-to-r2.sh
#
# Prerequisites:
# - Wrangler CLI installed: npm install -g wrangler
# - Logged in: wrangler login
# - Bucket created: wrangler r2 bucket create marina-one-panoramas-v2
#

set -e

BUCKET_NAME="marina-one-panoramas-v2"
LOCAL_DIR="public/assets/panoramas"

echo "🚀 Uploading panoramas to R2 bucket: $BUCKET_NAME"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found"
    echo "   Install with: npm install -g wrangler"
    exit 1
fi

# Check if local directory exists
if [ ! -d "$LOCAL_DIR" ]; then
    echo "❌ Error: Directory not found: $LOCAL_DIR"
    exit 1
fi

# Count files
FILE_COUNT=$(ls -1 "$LOCAL_DIR"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
if [ "$FILE_COUNT" -eq 0 ]; then
    echo "❌ Error: No .jpg files found in $LOCAL_DIR"
    exit 1
fi

echo "📁 Found $FILE_COUNT files to upload"
echo ""

# Upload each file
for filepath in "$LOCAL_DIR"/*.jpg; do
    filename=$(basename "$filepath")
    filesize=$(du -h "$filepath" | cut -f1)
    
    echo "⬆️  Uploading: $filename ($filesize)"
    
    wrangler r2 object put "$BUCKET_NAME/$filename" \
        --file="$filepath" \
        --content-type="image/jpeg"
    
    echo "   ✅ Done"
    echo ""
done

echo "🎉 All files uploaded successfully!"
echo ""
echo "Next steps:"
echo "1. Enable public access: wrangler r2 bucket domain $BUCKET_NAME"
echo "2. Configure CORS: wrangler r2 bucket cors put $BUCKET_NAME --config=scripts/r2-cors.json"
echo "3. Update NEXT_PUBLIC_R2_DOMAIN in .env.local with the public domain"
