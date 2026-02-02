# R2 Bucket Setup - Marina One Panoramas v2

## ✅ Completed Steps

1. **Created bucket:** `marina-one-panoramas-v2`
2. **Uploaded files:** All 9 panorama files (489MB total)
   - 6 panoramic images (14400x7200, 2:1 ratio)
   - 3 photo fallbacks
3. **Configured CORS:** Allows localhost:3000, localhost:3002
4. **Updated wrangler.toml:** Bucket binding configured

## 🔄 Next Steps - Enable Public Access

### Option 1: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **marina-one-panoramas-v2**
3. Click **Settings** → **Public Access**
4. Click **Allow Access** and choose **Connect r2.dev subdomain**
5. Copy the public domain URL (format: `https://pub-xxxxx.r2.dev`)
6. Save the URL - you'll need it for configuration

### Option 2: Via Custom Domain (Optional)

If you want to use your own domain:
```bash
wrangler r2 bucket domain add marina-one-panoramas-v2 \
  --domain your-domain.com \
  --zone-id YOUR_ZONE_ID
```

## 📝 Configuration Updates Needed

Once you have the public R2 domain:

### 1. Create `.env.local` file:
```env
# R2 Public Domain (get from Cloudflare Dashboard)
NEXT_PUBLIC_R2_DOMAIN=https://pub-xxxxx.r2.dev

# Set to true to use R2 URLs instead of local files
NEXT_PUBLIC_USE_R2=false

# Cloudflare Account ID (optional)
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

### 2. Add Vercel domain to CORS:

Once deployed to Vercel, update `scripts/r2-cors.json`:
```json
{
  "rules": [
    {
      "allowed": {
        "origins": [
          "http://localhost:3000",
          "http://localhost:3002",
          "https://your-app.vercel.app"
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

Then apply:
```bash
wrangler r2 bucket cors set marina-one-panoramas-v2 --file=scripts/r2-cors.json -y
```

## 🧪 Testing

### Test R2 URLs:
```bash
# List files
wrangler r2 object get marina-one-panoramas-v2/floor-44-panoramic.jpg --pipe > /tmp/test.jpg
open /tmp/test.jpg

# Or test via public URL (after enabling public access)
curl -I https://pub-xxxxx.r2.dev/floor-44-panoramic.jpg
```

### Test CORS:
```bash
curl -I -H "Origin: http://localhost:3000" https://pub-xxxxx.r2.dev/floor-44-panoramic.jpg
# Should see Access-Control-Allow-Origin header
```

## 🗑️ Old Bucket Cleanup

The old bucket `marina-one-panaroma-images` can be deleted after verifying the new setup:
```bash
# ⚠️ WARNING: This will permanently delete all files!
wrangler r2 bucket delete marina-one-panaroma-images -y
```

## 📂 File Structure in R2

```
marina-one-panoramas-v2/
├── floor-44-panoramic.jpg  (64M - 360° panorama)
├── floor-48-panoramic.jpg  (9.4M - 360° panorama)
├── floor-52-panoramic.jpg  (64M - 360° panorama)
├── floor-56-photo.jpg      (63M - photo fallback)
├── floor-60-panoramic.jpg  (69M - 360° panorama)
├── floor-64-photo.jpg      (46M - photo fallback)
├── floor-68-panoramic.jpg  (68M - 360° panorama)
├── floor-72-photo.jpg      (34M - photo fallback)
└── floor-75-panoramic.jpg  (70M - 360° panorama)
```

## 🔗 Useful Commands

```bash
# List all objects
wrangler r2 object list marina-one-panoramas-v2

# Check CORS configuration
wrangler r2 bucket cors list marina-one-panoramas-v2

# Get object metadata
wrangler r2 object info marina-one-panoramas-v2/floor-44-panoramic.jpg

# Delete object (if needed)
wrangler r2 object delete marina-one-panoramas-v2/filename.jpg
```
