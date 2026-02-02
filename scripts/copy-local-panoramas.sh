#!/bin/bash
# Copy one panoramic image per floor from .processing to public/assets/panoramas/

PROCESSING_DIR=".processing"
DEST_DIR="public/assets/panoramas"

mkdir -p "$DEST_DIR"

# Floor 44 (154m)
cp "$PROCESSING_DIR/Day View/154m/Central sea facing/DJI_20260117140647_0007_D copy.jpg" "$DEST_DIR/44f.jpg"

# Floor 48 (167m)
cp "$PROCESSING_DIR/Day View/167m/Central sea facing/DJI_20260117140934_0010_D copy 2.jpg" "$DEST_DIR/48f.jpg"

# Floor 52 (182m)
cp "$PROCESSING_DIR/Day View/182m/Central Sea facing/DJI_20260117143526_0034_D copy 2.jpg" "$DEST_DIR/52f.jpg"

# Floor 56 (210m)
cp "$PROCESSING_DIR/Day View/210m/Central sea facing/DJI_20260117145106_0057_D copy.jpg" "$DEST_DIR/56f.jpg"

# Floor 60 (224m)
cp "$PROCESSING_DIR/Day View/224m/Central sea facing/DJI_20260117145924_0071_D copy 2.jpg" "$DEST_DIR/60f.jpg"

# Floor 64 (238m)
cp "$PROCESSING_DIR/Day View/238m/Central sea facing/DJI_20260117150836_0079_D copy 2.jpg" "$DEST_DIR/64f.jpg"

# Floor 68 (196m)
cp "$PROCESSING_DIR/Day View/196m/Central sea facing/DJI_20260117144321_0046_D copy 2.jpg" "$DEST_DIR/68f.jpg"

# Floor 72 (252m) - using marine line (no central sea)
cp "$PROCESSING_DIR/Day View/252m/marine line facing/DJI_20260117151437_0087_D copy.jpg" "$DEST_DIR/72f.jpg"

# Floor 75 (266m) - using Sea facing
cp "$PROCESSING_DIR/Day View/266m/Sea facing/DJI_20260117152723_0107_D copy.jpg" "$DEST_DIR/75f.jpg"

echo "✅ Copied 9 panoramic images to $DEST_DIR"
ls -lh "$DEST_DIR"
