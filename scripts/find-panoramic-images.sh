#!/bin/bash
# Find and list panoramic images (2:1 aspect ratio) for each elevation

echo "Scanning for panoramic images (2:1 aspect ratio)..."
echo ""

cd "/Volumes/madara/2026/marina-one/panorama-viewer-marina/.processing/Day View"

for elevation_dir in */; do
  elevation=$(basename "$elevation_dir")
  echo "=== $elevation ==="
  
  for dir in "$elevation_dir"*/; do
    for img in "$dir"*.jpg; do 
      if [ -f "$img" ]; then
        dims=$(sips -g pixelWidth -g pixelHeight "$img" 2>/dev/null | grep pixel | awk '{print $2}')
        width=$(echo "$dims" | sed -n '1p')
        height=$(echo "$dims" | sed -n '2p')
        
        if [ ! -z "$width" ] && [ ! -z "$height" ]; then
          ratio=$(echo "scale=2; $width / $height" | bc)
          
          # Check if ratio is 2.00 (panoramic)
          if [ "$ratio" = "2.00" ]; then
            size=$(ls -lh "$img" | awk '{print $5}')
            direction=$(basename "$(dirname "$img")")
            filename=$(basename "$img")
            echo "  ✓ $size | ${width}x${height} | $direction | $filename"
          fi
        fi
      fi
    done
  done
  echo ""
done
