#!/bin/bash

# Script to import alternative views (other side) from .processing
# Mapping elevations to floors correctly

set -e

BASE_DIR="/Volumes/madara/2026/marina-one/panorama-viewer-marina"
PROC_DIR="${BASE_DIR}/.processing/Day View"
DEST_DIR="${BASE_DIR}/public/assets/panoramas"

# Elevation -> Floor mapping
# Format: "elevation:floor:direction_keyword"
MAPPING=(
  "154:44:Marine"
  "167:48:Central" # Fallback if no second side
  "182:52:Marine"
  "196:56:Marine"
  "210:60:Marine"
  "224:64:Marine"
  "238:68:Marine"
  "252:72:Marine"
  "266:75:Marine"
)

echo "📂 Importing alternative views..."

for entry in "${MAPPING[@]}"; do
  elev=$(echo $entry | cut -d: -f1)
  floor=$(echo $entry | cut -d: -f2)
  keyword=$(echo $entry | cut -d: -f3)
  
  # Find the directory for this elevation
  elev_dir=$(find "$PROC_DIR" -maxdepth 1 -type d -name "${elev}*" | head -n 1)
  
  if [ -n "$elev_dir" ]; then
    # Find the direction folder
    dir_folder=$(find "$elev_dir" -maxdepth 1 -type d -iname "*${keyword}*" | head -n 1)
    
    if [ -n "$dir_folder" ]; then
      # Find the first JPG in that folder
      src_img=$(find "$dir_folder" -name "*.jpg" | head -n 1)
      
      if [ -n "$src_img" ]; then
        dest_filename="floor-${floor}-marine.jpg"
        echo "✅ Found: $src_img -> $dest_filename"
        cp "$src_img" "${DEST_DIR}/${dest_filename}"
      else
        echo "❌ No JPG found for floor $floor ($elevm, $keyword)"
      fi
    else
      # Try Stadium if Marine not found
      dir_folder=$(find "$elev_dir" -maxdepth 1 -type d -iname "*Stadium*" | head -n 1)
      if [ -n "$dir_folder" ]; then
        src_img=$(find "$dir_folder" -name "*.jpg" | head -n 1)
        if [ -n "$src_img" ]; then
          dest_filename="floor-${floor}-stadium.jpg"
          echo "✅ Found Stadium: $src_img -> $dest_filename"
          cp "$src_img" "${DEST_DIR}/${dest_filename}"
        fi
      else
        echo "❌ No alternative side found for floor $floor ($elevm)"
      fi
    fi
  else
    echo "❌ Elevation directory ${elev}m not found"
  fi
done

echo "🎉 Alternative views imported!"
echo "🚀 Running optimization..."
cd "$BASE_DIR" && npm run optimize
