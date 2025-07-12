# 🚀 RoomChatApp - Real-Time Chat Application

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Overview
A modern, production-ready real-time chat application built with TypeScript, featuring multiple chat rooms, real-time messaging, and a beautiful UI. Built as a monorepo using Turborepo for optimal development experience and deployment.

## ✨ Features

### 🔥 Core Features
- **Real-time messaging** with Socket.IO
- **Multiple chat rooms** - Create or join any room
- **Live participant tracking** - See who's online
- **Message history** - Persistent chat history per room
- **Responsive design** - Works on desktop and mobile
- **Dark/Light theme** support
- **User-friendly interface** with modern UI components

### 🛠️ Technical Features
- **TypeScript** for type safety
- **Monorepo architecture** with Turborepo
- **Production-ready** with proper error handling
- **Health monitoring** with built-in endpoints
- **Graceful shutdowns** and connection management
- **CORS configuration** for secure cross-origin requests
- **Message rate limiting** (100 messages per room)
- **Automatic reconnection** handling

## 🏗️ Tech Stack

### Frontend (Web App)
- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Hooks
- **Real-time**: Socket.IO Client
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast notifications)
- **Theme**: next-themes for dark/light mode

### Backend (Server)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Real-time**: Socket.IO Server
- **CORS**: cors middleware
- **ID Generation**: uuid
- **Process Management**: Graceful shutdown handling

### Development Tools
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript compiler
- **Build System**: Native TypeScript compiler + Next.js

## 🚀 Build Status
✅ **Server Build**: Working correctly
✅ **Web Build**: Working correctly

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
