# Manual Tasks - Marina One Panorama Viewer

## ⏳ Pending Tasks (Requires Manual Action)

### 1. Enable R2 Public Access
**Status:** Not started  
**Priority:** High (required for production deployment)

**Steps:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **marina-one-panoramas-v2**
3. Click **Settings** → **Public Access**
4. Click **Allow Access** → **Connect r2.dev subdomain**
5. Copy the public domain URL (format: `https://pub-xxxxx.r2.dev`)
6. Update `.env.local` with:
   ```env
   NEXT_PUBLIC_R2_DOMAIN=https://pub-xxxxx.r2.dev
   NEXT_PUBLIC_USE_R2=true
   ```

### 2. Add Vercel Domain to CORS
**Status:** Not started  
**Priority:** Medium (after Vercel deployment)

**Prerequisites:** Deploy to Vercel first, get the domain

**Steps:**
1. Deploy the app to Vercel
2. Note your Vercel domain (e.g., `https://marina-one.vercel.app`)
3. Edit `scripts/r2-cors.json`:
   ```json
   {
     "rules": [
       {
         "allowed": {
           "origins": [
             "http://localhost:3000",
             "http://localhost:3002",
             "https://YOUR-VERCEL-DOMAIN.vercel.app"
           ],
           "methods": ["GET", "HEAD"],
           "headers": ["*"]
         },
         "exposeHeaders": ["ETag"],
         "maxAgeSeconds": 3600
       }
     ]
   }
   ```
4. Apply CORS update:
   ```bash
   wrangler r2 bucket cors set marina-one-panoramas-v2 --file=scripts/r2-cors.json -y
   ```

### 3. Test R2 URLs and CORS
**Status:** Not started  
**Priority:** High (before production)

**Steps:**
1. After enabling public access, test direct URL:
   ```bash
   curl -I https://pub-xxxxx.r2.dev/floor-44-panoramic.jpg
   ```
   Should return: `HTTP/2 200` with `Content-Type: image/jpeg`

2. Test CORS headers:
   ```bash
   curl -I -H "Origin: http://localhost:3000" https://pub-xxxxx.r2.dev/floor-44-panoramic.jpg
   ```
   Should include: `Access-Control-Allow-Origin: http://localhost:3000`

3. Test in browser:
   - Set `NEXT_PUBLIC_USE_R2=true` in `.env.local`
   - Run `npm run dev`
   - Open browser console, check for CORS errors
   - Verify panoramas load from R2

### 4. Delete Old R2 Bucket (Optional)
**Status:** Not started  
**Priority:** Low (cleanup task)

**Prerequisites:** Verify new bucket works in production first

**Steps:**
1. Confirm new bucket is working correctly in production
2. Delete old bucket:
   ```bash
   wrangler r2 bucket delete marina-one-panaroma-images -y
   ```
   ⚠️ **WARNING:** This permanently deletes all files!

### 5. Deploy to Vercel
**Status:** Not started  
**Priority:** High (production deployment)

**Steps:**
1. Push code to GitHub (if not already)
2. Go to [Vercel Dashboard](https://vercel.com/)
3. Import the repository
4. Configure environment variables:
   ```env
   NEXT_PUBLIC_R2_DOMAIN=https://pub-xxxxx.r2.dev
   NEXT_PUBLIC_USE_R2=true
   ```
5. Deploy and test
6. Note the Vercel domain for CORS update (Task #2)

## ✅ Completed Tasks

- [x] Rename all panorama files with clean convention
- [x] Create new R2 bucket: `marina-one-panoramas-v2`
- [x] Upload all 9 files to R2 bucket
- [x] Configure initial CORS (localhost only)
- [x] Update configuration files
- [x] Create R2 setup documentation
- [x] Git commit initial working state

## 📝 Notes

- **Current state:** Using local files from `public/assets/panoramas/`
- **R2 ready:** Files uploaded, CORS configured for localhost
- **Production switch:** Set `NEXT_PUBLIC_USE_R2=true` after enabling public access
- **File size:** ~489MB total (9 files)
- **Bucket location:** Cloudflare R2, bucket name: `marina-one-panoramas-v2`

## 🔗 Related Documentation

- [R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md) - Detailed R2 setup instructions
- [.env.local.example](.env.local.example) - Environment variable template
- [scripts/upload-to-r2.sh](scripts/upload-to-r2.sh) - Automated upload script
