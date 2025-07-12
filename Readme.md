# Production Build Guide

## Overview
This guide covers building the chat application for production deployment. The server is built with TypeScript and compiled to JavaScript in the `dist` directory.

## Build Status
✅ **Server Build**: Working correctly
⚠️ **Web Build**: Has dependency issues (see troubleshooting section)

## Quick Start - Server Only

### Build the Server
```bash
# Build only the server (recommended for production)
npm run build:server
```

### Start the Server
```bash
# Start the built server
npm run start:server

# Or start with production environment
npm run start:prod
```

## Build Scripts

### Development
```bash
npm run dev              # Start all services in development mode
npm run dev:server       # Start only server in development mode
npm run dev:web         # Start only web app in development mode
```

### Production
```bash
npm run build           # Build all packages
npm run build:server    # Build only server
npm run build:web       # Build only web app
npm run build:prod      # Build all packages with production optimizations
```

## Server Build Details

### TypeScript Configuration
- **Source Directory**: `apps/server/src/`
- **Build Output**: `apps/server/dist/`
- **Entry Point**: `apps/server/dist/index.js`

### Build Features
- ✅ TypeScript compilation to CommonJS
- ✅ Source maps generation
- ✅ Type declarations (.d.ts files)
- ✅ Clean builds (removes old dist files)
- ✅ Type checking before build
- ✅ Production-ready error handling

### Environment Variables
```bash
PORT=3001                    # Server port (default: 3001)
CLIENT_URL=http://localhost:3000  # Client URL for CORS
NODE_ENV=production         # Environment mode
```

## Production Deployment

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Deployment Steps
1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build the server**:
   ```bash
   npm run build:server
   ```

3. **Start the server**:
   ```bash
   cd apps/server
   NODE_ENV=production node dist/index.js
   ```

### Health Check
Once deployed, verify the server is running:
- Health endpoint: `http://localhost:3001/api/health`
- Stats endpoint: `http://localhost:3001/api/stats`

## Troubleshooting

### Web Build Issues
The web application currently has dependency resolution issues with the `@/components/ui/sonner` import. This is a Next.js path alias issue.

**Current Status**: Server builds successfully, web build needs debugging.

### Server Build Issues
If you encounter TypeScript errors:
1. Check that all dependencies are installed: `pnpm install`
2. Verify TypeScript configuration in `apps/server/tsconfig.json`
3. Run type checking: `npm run type-check`

### Common Issues
- **rimraf not found**: Install missing dependency with `pnpm install`
- **Type annotation errors**: Check Express type imports
- **Path resolution**: Verify TypeScript baseUrl and paths configuration

## File Structure
```
apps/
├── server/
│   ├── src/           # TypeScript source files
│   ├── dist/          # Compiled JavaScript (production ready)
│   ├── package.json   # Server dependencies and scripts
│   └── tsconfig.json  # TypeScript configuration
└── web/
    ├── app/           # Next.js app directory
    ├── components/    # React components
    └── package.json   # Web app dependencies
```

## Performance Optimizations
- Source maps enabled for debugging
- Comments removed in production builds
- Type declarations generated for better IDE support
- Clean builds to prevent stale files

## Security Considerations
- CORS properly configured for client URLs
- Environment variables for sensitive configuration
- Error handling middleware for production
- Graceful shutdown handlers for SIGTERM/SIGINT
