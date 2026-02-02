#!/bin/bash

# Manual panorama quality checker
# Helps identify poorly stitched or fake panoramas

set -e

PANORAMA_DIR="public/assets/panoramas"

echo "🔍 Panorama Quality Checker"
echo "=============================="
echo ""

echo "📊 Analyzing all panorama files..."
echo ""

for file in ${PANORAMA_DIR}/floor-*.jpg; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    
    # Get dimensions
    width=$(sips -g pixelWidth "$file" | grep pixelWidth | awk '{print $2}')
    height=$(sips -g pixelHeight "$file" | grep pixelHeight | awk '{print $2}')
    ratio=$(echo "scale=2; $width / $height" | bc)
    
    # Get file size
    size=$(ls -lh "$file" | awk '{print $5}')
    
    echo "📁 $filename"
    echo "   Dimensions: ${width}x${height} (ratio: $ratio)"
    echo "   File size: $size"
    
    # Quality assessment
    if [ "$ratio" = "2.00" ]; then
      echo "   ✅ TRUE PANORAMA (2:1 ratio - proper equirectangular)"
    elif [ "$ratio" = "1.77" ] || [ "$ratio" = "1.78" ]; then
      echo "   ⚠️  REGULAR PHOTO (16:9 ratio - NOT a panorama)"
      echo "   💡 Recommendation: Mark as isPanoramic: false"
    elif [ "$ratio" = "1.38" ] || [ "$ratio" = "1.33" ]; then
      echo "   ⚠️  REGULAR PHOTO (4:3 ratio - NOT a panorama)"
      echo "   💡 Recommendation: Mark as isPanoramic: false"
    else
      echo "   ⚠️  UNUSUAL RATIO - manually verify quality"
    fi
    
    echo ""
  fi
done

echo "=============================="
echo "🎯 Summary:"
echo ""
echo "TRUE PANORAMAS (2:1 ratio):"
ls ${PANORAMA_DIR}/*-panoramic.jpg 2>/dev/null | wc -l | xargs echo "   Count:"
echo ""
echo "REGULAR PHOTOS (not panoramic):"
ls ${PANORAMA_DIR}/*-photo.jpg 2>/dev/null | wc -l | xargs echo "   Count:"
echo ""
echo "💡 Next Steps:"
echo "   1. Review config in lib/panoramaConfig.simple.ts"
echo "   2. Ensure isPanoramic: false for all *-photo.jpg files"
echo "   3. Test each floor in the viewer"
echo "   4. If stitching is poor, consider re-processing or use alternative angle"
