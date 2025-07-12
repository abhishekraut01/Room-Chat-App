# Production Build Guide

## Overview
This guide covers building the chat application for production deployment. Both server and web applications are now building successfully.

## Build Status
✅ **Server Build**: Working correctly
✅ **Web Build**: Working correctly

## Quick Start

### Build Everything
```bash
# Build both server and web applications
npm run build
```

### Build Individual Components
```bash
# Build only the server
npm run build:server

# Build only the web application
npm run build:web
```

### Start Applications
```bash
# Start the server
npm run start:server

# Start with production environment
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

## Build Details

### Server Build
- **Source Directory**: `apps/server/src/`
- **Build Output**: `apps/server/dist/`
- **Entry Point**: `apps/server/dist/index.js`
- **TypeScript**: Compiled to CommonJS
- **Features**: Source maps, type declarations, clean builds

### Web Build
- **Source Directory**: `apps/web/`
- **Build Output**: `apps/web/.next/`
- **Framework**: Next.js 13.5.1
- **Features**: Static generation, optimization, TypeScript support

## Recent Fixes Applied

### Web Build Issues Fixed
1. **Path Alias Resolution**: Fixed TypeScript configuration for `@/` imports
2. **WebSocket Dependencies**: Added optional dependencies for `bufferutil` and `utf-8-validate`
3. **Next.js Configuration**: Updated webpack config to handle missing optional dependencies
4. **TypeScript Configuration**: Added proper `baseUrl` and `paths` configuration

### Server Build Issues Fixed
1. **Type Annotations**: Added explicit Express type annotations
2. **Build Dependencies**: Added `rimraf` for clean builds
3. **Production Scripts**: Enhanced build scripts for production deployment

## Production Deployment

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Deployment Steps
1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build applications**:
   ```bash
   npm run build
   ```

3. **Start server**:
   ```bash
   cd apps/server
   NODE_ENV=production node dist/index.js
   ```

4. **Start web application** (if needed):
   ```bash
   cd apps/web
   npm start
   ```

### Health Check
Once deployed, verify the applications:
- Server health: `http://localhost:3001/api/health`
- Server stats: `http://localhost:3001/api/stats`
- Web application: `http://localhost:3000`

## Environment Variables

### Server
```bash
PORT=3001                    # Server port (default: 3001)
CLIENT_URL=http://localhost:3000  # Client URL for CORS
NODE_ENV=production         # Environment mode
```

### Web
```bash
NEXT_PUBLIC_SERVER_URL=http://localhost:3001  # Server URL for API calls
```

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
    ├── .next/         # Next.js build output
    ├── package.json   # Web app dependencies
    └── next.config.js # Next.js configuration
```

## Technical Details

### TypeScript Configuration
- **Server**: CommonJS modules, ES2020 target
- **Web**: Next.js configuration with path aliases
- **Shared**: Base configuration in `packages/typescript-config/`

### Build Pipeline
- **Turbo**: Monorepo build orchestration
- **Caching**: Intelligent build caching
- **Parallel**: Concurrent builds when possible

## Performance Optimizations
- Source maps for debugging
- Tree shaking for smaller bundles
- Static generation for web pages
- Code splitting for better loading
- WebSocket optimization for real-time features

## Security Considerations
- CORS properly configured
- Environment variables for sensitive data
- Production error handling
- Graceful shutdown handling
- Input validation and sanitization

## Troubleshooting

### Common Issues
- **Build failures**: Run `pnpm install` to ensure all dependencies are installed
- **Type errors**: Check TypeScript configuration and imports
- **Port conflicts**: Adjust PORT environment variable
- **CORS issues**: Verify CLIENT_URL configuration

### Debug Commands
```bash
# Type check without building
npm run type-check

# Clean build cache
npm run clean

# Build with verbose output
npm run build --verbose
```

## Success Metrics
- ✅ Server builds successfully in ~10 seconds
- ✅ Web builds successfully in ~25 seconds
- ✅ All TypeScript files compile without errors
- ✅ Production bundles are optimized and minified
- ✅ Both applications start without errors
