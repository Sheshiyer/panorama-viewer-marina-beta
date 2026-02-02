# Copilot Instructions for AI Coding Agents

## Project Overview
- **9-Floor Panorama Viewer** built with Next.js (app directory, TypeScript)
- Core feature: interactive 360° panoramas - one high-quality panoramic image per floor
- **9 panoramic images** (6 true panoramics 14400x7200 + 3 photo fallbacks)
- Images stored locally in `public/assets/panoramas/` and mirrored to Cloudflare R2
- Simplified architecture: one panorama per floor for optimal performance
- Clean file naming: `floor-{N}-panoramic.jpg` or `floor-{N}-photo.jpg`

## Key Architecture & Patterns
- **Panorama data/config:**
  - `lib/panoramaConfig.simple.ts` — **manual config** for 9 floors with image paths and `isPanoramic` flag
  - `lib/config/r2.ts` — R2 bucket configuration and helper functions
  - `lib/config/environment.ts` — environment variables and feature flags
  - No multi-res tiles — using direct equirectangular images
  
- **UI Components:**
  - All panoramic UI in `components/panoramic/`
  - `SimplePanoramaViewer.tsx` — loads one panorama per floor, handles both 360° and regular photos
  - `SimplePanoramaShell.tsx` — main container with floor selector and logos
  - Three logo overlays: YM Infra, Ashwin Sheth Group, One Marina
  
- **Image Loading:**
  - **Current:** Local files from `public/assets/panoramas/`
  - **Production option:** Can use R2 URLs by setting `NEXT_PUBLIC_USE_R2=true`
  - CORS configured on R2 bucket: `marina-one-panoramas-v2`
  - Pannellum library handles 360° rendering with equirectangular projection
  
- **Scripts & Tools:**
  - **Upload to R2:** `./scripts/upload-to-r2.sh` — uploads all files to R2 bucket
  - **Find panoramics:** `./scripts/find-panoramic-images.sh` — checks dimensions for 2:1 ratio
  - **CORS config:** `scripts/r2-cors.json` — CORS rules for R2 bucket

## File Structure
```
public/assets/panoramas/
├── floor-44-panoramic.jpg  (64M - 360° panorama, 14400x7200)
├── floor-48-panoramic.jpg  (9.4M - 360° panorama, 14400x7200)
├── floor-52-panoramic.jpg  (64M - 360° panorama, 14400x7200)
├── floor-56-photo.jpg      (63M - regular photo fallback)
├── floor-60-panoramic.jpg  (69M - 360° panorama, 14400x7200)
├── floor-64-photo.jpg      (46M - regular photo fallback)
├── floor-68-panoramic.jpg  (68M - 360° panorama, 14400x7200)
├── floor-72-photo.jpg      (34M - regular photo fallback)
└── floor-75-panoramic.jpg  (70M - 360° panorama, 14400x7200)
```

## Floor Mapping
- 44F (154m) - Panoramic ✓
- 48F (167m) - Panoramic ✓
- 52F (182m) - Panoramic ✓
- 56F (210m) - Photo fallback
- 60F (224m) - Panoramic ✓
- 64F (238m) - Photo fallback
- 68F (196m) - Panoramic ✓
- 72F (252m) - Photo fallback
- 75F (266m) - Panoramic ✓

## Developer Workflows
- **Start dev server:** `npm run dev` (port 3002 if 3000 is occupied)
- **Build:** `npm run build`
- **Upload to R2:** `./scripts/upload-to-r2.sh`
- **Configure CORS:** `wrangler r2 bucket cors set marina-one-panoramas-v2 --file=scripts/r2-cors.json -y`
- **Deployment:** Vercel recommended for production

## Environment Configuration
Create `.env.local` (see `.env.local.example` for template):
```env
# Use R2 URLs instead of local files (default: false)
NEXT_PUBLIC_USE_R2=false

# R2 public domain (get from Cloudflare Dashboard)
NEXT_PUBLIC_R2_DOMAIN=https://pub-xxxxx.r2.dev
```

## R2 Bucket Setup
- **Bucket name:** `marina-one-panoramas-v2`
- **Files:** 9 panorama/photo files (~489MB total)
- **CORS:** localhost:3000, localhost:3002, + production domains
- **Public access:** Configure via Cloudflare Dashboard (see `R2_SETUP_GUIDE.md`)
- **Old bucket:** `marina-one-panaroma-images` (can be deleted after verification)

## Project Conventions
- **Naming:** `floor-{N}-panoramic.jpg` for 360° images, `floor-{N}-photo.jpg` for regular photos
- **Dimensions:** True panoramics are 14400x7200 (2:1 aspect ratio)
- **Config:** `panoramaConfig.simple.ts` is manually maintained (not auto-generated)
- **UI state:** Floor selection managed in React state
- **Fallback badge:** Photo fallbacks show "📷 Regular Photo View" badge

## Current State
- **Simplified architecture:** One image per floor for better performance and maintainability
- **6 true panoramic images:** 44F, 48F, 52F, 60F, 68F, 75F (14400x7200, 2:1 ratio)
- **3 photo fallbacks:** 56F, 64F, 72F (regular photos, not 360°)
- **All images validated:** Using dimension checks (`sips` tool) to verify 2:1 ratio
- **R2 ready:** Files uploaded to new bucket with CORS configured

## References
- `R2_SETUP_GUIDE.md` — R2 bucket setup and configuration instructions
- `README.md` — Project overview and getting started
- `.env.local.example` — Environment variable template
- `components/panoramic/` — UI components
- `lib/config/` — Configuration modules
- `scripts/` — Automation scripts

---
**For AI agents:**
- **Config is manual:** Edit `panoramaConfig.simple.ts` directly (not auto-generated)
- **Clean naming convention:** Use `floor-{N}-panoramic.jpg` or `floor-{N}-photo.jpg`
- **Dimension verification:** True panoramics are 14400x7200 (2:1 ratio)
- **R2 bucket:** `marina-one-panoramas-v2` for production deployments
- **Local development:** Uses files from `public/assets/panoramas/` by default
- **See `R2_SETUP_GUIDE.md`** for R2 deployment and CORS setup
