# 🚀 Deployment Guide

## Important Note about Vercel

**Vercel is NOT suitable for your backend** because it uses serverless functions, which don't support persistent WebSocket connections required by Socket.IO. Your backend needs to run on a platform that supports long-running processes.

## Recommended Deployment Strategy

### Frontend (Web App) → Vercel ✅
- Deploy your web app to Vercel
- Perfect for Next.js applications

### Backend (Server) → Railway/Render/Heroku ✅
- Deploy your server to Railway, Render, or Heroku
- These platforms support persistent WebSocket connections

## 📋 Step-by-Step Deployment

### 1. Deploy Backend to Railway (Recommended)

1. **Sign up for Railway**: https://railway.app/
2. **Connect your GitHub repository**
3. **Create a new project**
4. **Deploy from GitHub**
5. **Add environment variables:**
   ```
   NODE_ENV=production
   PORT=$PORT
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
6. **Railway will automatically detect and build your project**

### 2. Deploy Backend to Render

1. **Sign up for Render**: https://render.com/
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure build settings:**
   - Build Command: `npm install && npm run build:server`
   - Start Command: `cd apps/server && node dist/index.js`
5. **Add environment variables:**
   ```
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

### 3. Deploy Backend to Heroku

1. **Install Heroku CLI**
2. **Login to Heroku:** `heroku login`
3. **Create a new app:** `heroku create your-app-name`
4. **Add buildpacks:**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```
5. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
   ```
6. **Deploy:** `git push heroku main`

### 4. Deploy Frontend to Vercel

1. **Sign up for Vercel**: https://vercel.com/
2. **Connect your GitHub repository**
3. **Configure project settings:**
   - Framework: Next.js
   - Root directory: `apps/web`
   - Build command: `npm run build:web`
   - Output directory: `apps/web/.next`
4. **Add environment variables:**
   ```
   NEXT_PUBLIC_SERVER_URL=https://your-backend-url.railway.app
   ```
5. **Deploy**

## 🔧 Configuration Updates

### Update Backend URLs

1. **Edit `apps/server/src/index.ts`**:
   ```typescript
   const PRODUCTION_URLS = [
     'https://your-frontend-url.vercel.app', // Your actual Vercel URL
     'https://your-custom-domain.com',       // Your custom domain (if any)
     CLIENT_URL,
     'http://localhost:3000',
     'http://localhost:3001'
   ];
   ```

### Update Frontend URLs

1. **Edit `apps/web/lib/socket.ts`**:
   ```typescript
   if (process.env.NODE_ENV === 'production') {
     return 'https://your-backend-url.railway.app'; // Your actual backend URL
   }
   ```

2. **Add environment variable in Vercel**:
   ```
   NEXT_PUBLIC_SERVER_URL=https://your-backend-url.railway.app
   ```

## 🔍 Environment Variables

### Backend Environment Variables
```env
NODE_ENV=production
PORT=$PORT (auto-set by hosting platform)
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_SERVER_URL=https://your-backend-url.railway.app
```

## 🧪 Testing Deployment

### 1. Test Backend Health
```bash
curl https://your-backend-url.railway.app/api/health
```

### 2. Test Frontend Connection
1. Visit your Vercel URL
2. Open browser developer tools
3. Check if WebSocket connection is established
4. Test creating a room and sending messages

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your frontend URL is in the PRODUCTION_URLS array
   - Check that CLIENT_URL environment variable is set correctly

2. **WebSocket Connection Failed**:
   - Verify backend is running on a platform that supports WebSocket
   - Check if firewall is blocking WebSocket connections

3. **Build Failures**:
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

### Debug Commands

```bash
# Check backend health
curl https://your-backend-url.railway.app/api/health

# Check backend stats
curl https://your-backend-url.railway.app/api/stats

# Test WebSocket connection
# Use browser developer tools > Network tab > WS filter
```

## 🌟 Platform Comparisons

| Platform | Free Tier | WebSocket Support | Ease of Use | Recommended |
|----------|-----------|-------------------|-------------|-------------|
| Railway  | ✅ $5/month | ✅ Excellent | ✅ Very Easy | ⭐ **Best** |
| Render   | ✅ Limited | ✅ Good | ✅ Easy | ⭐ **Good** |
| Heroku   | ❌ Paid only | ✅ Excellent | ✅ Easy | ⭐ **Reliable** |
| Vercel   | ✅ Great | ❌ No Support | ✅ Very Easy | ❌ **Not for Backend** |

## 📝 Final Checklist

- [ ] Backend deployed to Railway/Render/Heroku
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] URLs updated in code
- [ ] CORS configured correctly
- [ ] Health check endpoint working
- [ ] WebSocket connection working
- [ ] End-to-end chat functionality tested

## 🎯 Quick Deploy Commands

```bash
# Build everything
npm run build

# Test locally before deploying
npm run dev

# Deploy to Railway (using Railway CLI)
railway login
railway link
railway up

# Deploy to Vercel (using Vercel CLI)
vercel --prod
```

Your chat application will then be fully deployed and accessible worldwide! 🌍
