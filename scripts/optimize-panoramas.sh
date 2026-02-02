#!/bin/bash

# Optimize panorama images for WebGL compatibility
# Ensures all images are within safe WebGL texture limits (8192px max)

set -e

PANORAMA_DIR="public/assets/panoramas"
MAX_SIZE=8192
BACKUP_DIR="${PANORAMA_DIR}/.originals"

echo "🖼️  Optimizing panorama images for WebGL compatibility"
echo "📏 Max size: ${MAX_SIZE}px"
echo ""

# Create backup directory
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
  echo "📁 Created backup directory: $BACKUP_DIR"
fi

# Process each image
for file in ${PANORAMA_DIR}/floor-*.jpg; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    
    # Get current dimensions
    width=$(sips -g pixelWidth "$file" | grep pixelWidth | awk '{print $2}')
    height=$(sips -g pixelHeight "$file" | grep pixelHeight | awk '{print $2}')
    
    echo "📐 $filename: ${width}x${height}"
    
    # Check if image needs resizing
    if [ "$width" -gt "$MAX_SIZE" ] || [ "$height" -gt "$MAX_SIZE" ]; then
      # Backup original
      if [ ! -f "${BACKUP_DIR}/${filename}" ]; then
        echo "   💾 Backing up original..."
        cp "$file" "${BACKUP_DIR}/${filename}"
      fi
      
      # Resize image
      echo "   ⚙️  Resizing to max ${MAX_SIZE}px..."
      sips -Z ${MAX_SIZE} "$file" --out "$file" > /dev/null
      
      # Get new dimensions
      new_width=$(sips -g pixelWidth "$file" | grep pixelWidth | awk '{print $2}')
      new_height=$(sips -g pixelHeight "$file" | grep pixelHeight | awk '{print $2}')
      echo "   ✅ Resized to: ${new_width}x${new_height}"
    else
      echo "   ✅ Already optimized (within limits)"
    fi
    echo ""
  fi
done

echo "🎉 All panoramas optimized!"
echo ""
echo "Original files backed up to: $BACKUP_DIR"
echo "To restore originals: cp ${BACKUP_DIR}/* ${PANORAMA_DIR}/"
