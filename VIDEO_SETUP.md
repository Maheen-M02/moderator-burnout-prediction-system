# Video Setup Guide

The landing page video is currently using a temporary URL that may have expired. Here's how to fix it:

## Option 1: Use Local Video (Recommended for Development)

1. Download or obtain your video file (MP4 format recommended)
2. Place it in `frontend/public/` folder
   - Example: `frontend/public/burnout-video.mp4`
3. Update `frontend/src/pages/Landing.jsx` line with video source:
   ```jsx
   <source src="/burnout-video.mp4" type="video/mp4" />
   ```

## Option 2: Use CDN (Recommended for Production)

### Using Cloudinary (Free tier available)
1. Sign up at https://cloudinary.com
2. Upload your video
3. Get the video URL
4. Update the source in Landing.jsx:
   ```jsx
   <source src="https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/YOUR_VIDEO_ID.mp4" type="video/mp4" />
   ```

### Using Vercel Blob Storage
1. Install: `npm install @vercel/blob`
2. Upload video via Vercel dashboard
3. Use the provided URL

### Using AWS S3
1. Upload to S3 bucket
2. Make it public or use signed URLs
3. Use the S3 URL

## Option 3: Use YouTube/Vimeo Embed

If you want to use YouTube or Vimeo:
1. Upload video as unlisted
2. Replace the `<video>` tag with an iframe embed
3. Style it to match the current design

## Current Fallback

If the video fails to load, the page now shows:
- Animated gradient background
- Floating particles
- Grid overlay

This ensures the page still looks good even without the video.

## Video Specifications

For best performance:
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 or 1280x720
- File size: Under 5MB for fast loading
- Duration: 10-30 seconds (looping)
- Optimize with tools like HandBrake or FFmpeg

## Testing

After updating the video source:
1. Test on desktop browser
2. Test on mobile (iOS Safari and Chrome)
3. Check browser console for any errors
4. Verify autoplay works (muted videos can autoplay)
