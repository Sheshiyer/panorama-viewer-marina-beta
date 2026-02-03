# Marina One - Advanced 360° Environment Simulator

An elite-tier, interactive 360° panorama viewer and environmental simulator for Marina One's premium floors (44F to 75F). This experience features a completely redesigned "Glass-Morphic" UI, real-time environmental data, and a high-performance R2 asset delivery system.

**By Ashwin Sheth Group & YM Infra**

---

## 🌟 Premium Features

### Immersion & Aesthetics
-   **Class-Leading "Glass" UI**: A minimalist interface designed with frosted glass aesthetics (`backdrop-blur`) that blends seamlessly into the sky, maximizing the viewable area.
-   **Live Compass Widget 🧭**: A real-time, rotating glass compass (Bottom-Left) that keeps you oriented as you explore the Mumbai skyline.
-   **Dynamic Time-of-Day**: Switch between Sunrise, Noon, Sunset, and Night with a smart selector that adapts to your screen size.
-   **Gyroscope "Magic Window" 📱**: On mobile devices, physically move your phone to look around the virtual world (requires HTTPS & device sensors).

### Performance & Architecture
-   **Cloudflare R2 Integration**: Assets are now served from a high-performance R2 bucket (`marina-one-assets-360all`), ensuring fast load times and handling massive 14k+ resolution textures.
-   **Smart Caching**: Implements aggressive caching strategies for instant subsequent loads.
-   **Responsive Core**: A single codebase that intelligently adapts layout, controls, and interaction models for both 8K desktop displays and mobile phones.

---

## 🏢 Connected Floors

Experience the tower from key vantage points:
-   **44th Floor**: Connectivity Level (154m)
-   **48th Floor**: Sea View Level (167m)
-   **52nd Floor**: Horizon Level (182m)
-   **60th Floor**: Cloud Level (224m)
-   **68th Floor**: Sky Level (196m)
-   **75th Floor**: Summit Level (266m)

*Note: Floors 56, 64, and 72 utilize high-res static photography fallbacks.*

---

## 🚀 Quick Start

### Prerequisites
-   Node.js 18+ or Bun
-   Bun (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd panorama-viewer-marina

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the experience.

---

## ⚙️ Configuration & R2

The project uses Cloudflare R2 for asset storage.

### Environment Variables (.env.local)

```env
# Enable R2 for production assets
NEXT_PUBLIC_USE_R2=true
NEXT_PUBLIC_R2_DOMAIN=https://startling-marina.r2.dev

# Feature Flags
NEXT_PUBLIC_ENABLE_AUTO_ROTATE=true
```

### Asset Management
Scripts are provided to manage assets:

-   `scripts/upload-to-r2.sh`: Uploads local assets to the defined R2 bucket.
-   `scripts/migrate-assets.ts`: Helper to move assets between buckets/folders.

---

## 📱 Mobile Experience

The mobile view has been specifically engineered for "thumb-friendly" usage:
-   **Floor Pill**: A floating bottom pill for easy floor switching.
-   **Smart Selectors**: Compact time and view controls.
-   **Hidden Clutter**: All desktop-only panels (like the robust unified controls) are replaced with atomic, mobile-first widgets.

---

## 🚢 Deployment

**Recommended: Vercel**

1.  Connect your GitHub repository to Vercel.
2.  Add the Environment Variables from `.env.local`.
3.  Deploy.

*Note: For Gyroscope features to work, the site MUST be served over HTTPS.*

---

## 📄 License

© 2026 Marina One by Ashwin Sheth Group & YM Infra. All rights reserved.
