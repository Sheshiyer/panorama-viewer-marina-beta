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
LOCAL_DIR="public/assets/panoramas-v2"

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

# Navigate to local dir to make relative paths easier
cd "$LOCAL_DIR" || exit 1

# Count files
FILE_COUNT=$(find . -type f -name "*.jpg" | wc -l | tr -d ' ')
if [ "$FILE_COUNT" -eq 0 ]; then
    echo "❌ Error: No .jpg files found in $LOCAL_DIR"
    exit 1
fi

echo "📁 Found $FILE_COUNT files to upload from $(pwd)"
echo ""

# Upload each file recursively
find . -type f -name "*.jpg" | while read -r filepath; do
    # Remove leading ./
    key=${filepath#./}
    
    echo "⬆️  Uploading: $key"
    
    wrangler r2 object put "$BUCKET_NAME/$key" \
        --file="$filepath" \
        --content-type="image/jpeg"
done

echo ""
echo "🎉 All files uploaded successfully!"
echo ""
echo "Next steps:"
echo "1. Enable public access: wrangler r2 bucket domain $BUCKET_NAME"
echo "2. Configure CORS: wrangler r2 bucket cors put $BUCKET_NAME --config=../../scripts/r2-cors.json"
echo "3. Update NEXT_PUBLIC_R2_DOMAIN in .env.local with the public domain"
