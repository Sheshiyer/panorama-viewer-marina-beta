# Marina One - Advanced 360° Environment Simulator

An elite-tier, interactive 360° panorama viewer and environmental simulator for Marina One's premium floors (44F to 75F). This is not just a gallery; it is a high-performance visual experience that mirrors real-world conditions.

**By Ashwin Sheth Group & YM Infra**

---

## 🌟 Why This Isn't a Standard Website

This project goes beyond standard web development to provide a truly immersive property experience:

- **81+ High-Definition Environments**: We've integrated nearly 100 unique panoramic views, capturing the tower from multiple angles across every floor.
- **Dynamic Time-of-Day System**: Experience the vista exactly as it looks at Morning, Noon, Evening, and Night, complete with an adaptive UI that shifts its color palette to match the mood of the sky.
- **Intelligent Performance Handling**: We implemented custom image-optimization pipelines that allow massive 14,000-pixel panoramic textures to load smoothly on mobile devices without crashing.
- **Live Environmental Data**: A real-time Mumbai weather engine and digital compass keep you grounded in the actual environment while you explore.
- **Cinematic Transitions**: Features an "Elevator Effect" with stylized overlays and progress bars that simulate the feeling of ascending through the tower.
- **Interactive Intelligence**: Landmark hotspots identify famous Mumbai sites (like the Atal Setu bridge), giving context to the breathtaking views.

---

## 🏢 Project Overview

**Marina One** is a luxury residential tower by Ashwin Sheth Group offering spectacular views of Mumbai. This panorama viewer provides an interactive way to explore:

- **9 Floors:** 44F to 75F
- **81+ Dynamic Views:** Integrated time-of-day and directional switching
- **Interactive Controls:** Floor selection, Compass navigation, and Weather tracking
- **Atmospheric UI:** Adaptive glassmorphism styling that follows the sun cycle

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd panorama-viewer-marina

# Install dependencies
npm install

# Create environment file (optional)
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or port 3002 if 3000 is occupied) to view the app.

---

## 📁 Project Structure

```
panorama-viewer-marina/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main panorama viewer page
│   ├── layout.tsx               # Root layout with logos
│   └── globals.css              # Global styles
├── components/panoramic/        # Panorama UI components
│   ├── SimplePanoramaShell.tsx # Main container with controls
│   ├── SimplePanoramaViewer.tsx # Pannellum integration
│   └── ...                      # Other UI components
├── lib/
│   ├── panoramaConfig.simple.ts # Floor configuration (manual)
│   ├── config/
│   │   ├── r2.ts               # R2 bucket helpers
│   │   └── environment.ts      # Environment config
│   └── pannellumLoader.ts      # Pannellum library loader
├── public/
│   ├── assets/panoramas/       # Local panorama images (489MB)
│   └── vendor/pannellum/       # Pannellum library files
├── scripts/
│   ├── upload-to-r2.sh         # Upload images to R2
│   ├── find-panoramic-images.sh # Dimension checker
│   └── r2-cors.json            # CORS configuration
├── R2_SETUP_GUIDE.md           # R2 deployment guide
├── MANUAL_TASKS.md             # Manual setup tasks
└── .context/                   # Internal documentation
```

---

## 🖼️ Panorama Files

### Floor Breakdown

| Floor | Elevation | Type | Filename | Size | Dimensions |
|-------|-----------|------|----------|------|------------|
| 44F | 154m | 360° Panorama | floor-44-panoramic.jpg | 64M | 14400x7200 |
| 48F | 167m | 360° Panorama | floor-48-panoramic.jpg | 9.4M | 14400x7200 |
| 52F | 182m | 360° Panorama | floor-52-panoramic.jpg | 64M | 14400x7200 |
| 56F | 210m | Photo Fallback | floor-56-photo.jpg | 63M | N/A |
| 60F | 224m | 360° Panorama | floor-60-panoramic.jpg | 69M | 14400x7200 |
| 64F | 238m | Photo Fallback | floor-64-photo.jpg | 46M | N/A |
| 68F | 196m | 360° Panorama | floor-68-panoramic.jpg | 68M | 14400x7200 |
| 72F | 252m | Photo Fallback | floor-72-photo.jpg | 34M | N/A |
| 75F | 266m | 360° Panorama | floor-75-panoramic.jpg | 70M | 14400x7200 |

**Total:** ~489MB (9 files)

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` (see `.env.local.example` for template):

```env
# Use R2 URLs instead of local files
NEXT_PUBLIC_USE_R2=false

# R2 public domain (set after enabling public access)
NEXT_PUBLIC_R2_DOMAIN=https://pub-xxxxx.r2.dev

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_HOTSPOTS=true
NEXT_PUBLIC_ENABLE_AUTO_ROTATE=true
```

### Image Loading

- **Development:** Uses local files from `public/assets/panoramas/`
- **Production:** Can use Cloudflare R2 by setting `NEXT_PUBLIC_USE_R2=true`

---

## ☁️ Cloudflare R2 Deployment

The project includes a Cloudflare R2 bucket for hosting panorama images in production.

### R2 Bucket Details

- **Bucket Name:** `marina-one-panoramas-v2`
- **Files:** 9 panorama/photo files (~489MB)
- **CORS:** Configured for localhost and production domains

### Setup Instructions

See [R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md) for complete R2 setup and deployment instructions.

Quick commands:
```bash
# Upload files to R2
./scripts/upload-to-r2.sh

# Configure CORS
wrangler r2 bucket cors set marina-one-panoramas-v2 --file=scripts/r2-cors.json -y

# List uploaded files
wrangler r2 object list marina-one-panoramas-v2
```

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding New Floors

1. Add panorama file to `public/assets/panoramas/`
   - Naming: `floor-{N}-panoramic.jpg` or `floor-{N}-photo.jpg`
   - For true panoramas: Must be 2:1 aspect ratio (e.g., 14400x7200)

2. Update `lib/panoramaConfig.simple.ts`:
   ```typescript
   {
     id: 10,
     label: "80th Floor",
     floorNumber: 80,
     elevation: 280,
     view: {
       image: "/assets/panoramas/floor-80-panoramic.jpg",
       isPanoramic: true,
     },
   }
   ```

3. Upload to R2: `./scripts/upload-to-r2.sh`

---

## 🏗️ Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **360° Viewer:** Pannellum 2.5.6
- **Styling:** Tailwind CSS
- **Cloud Storage:** Cloudflare R2
- **Deployment:** Vercel (recommended)

---

## 📖 Documentation

- [R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md) - Cloudflare R2 setup and configuration
- [MANUAL_TASKS.md](MANUAL_TASKS.md) - Manual setup tasks checklist
- [.context/](.context/) - Internal development documentation

---

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables:
   ```
   NEXT_PUBLIC_R2_DOMAIN=<your-r2-domain>
   NEXT_PUBLIC_USE_R2=true
   ```
4. Deploy!

See [MANUAL_TASKS.md](MANUAL_TASKS.md) for post-deployment tasks (CORS update).

---

## 📄 License

© 2026 Marina One by Ashwin Sheth Group & YM Infra. All rights reserved.

---

## 🤝 Credits

**Developed for:**
- Marina One - Luxury Residential Tower
- Ashwin Sheth Group
- YM Infra

**Technology:**
- Pannellum - 360° panorama viewer library
- Next.js - React framework
- Cloudflare R2 - Cloud object storage
