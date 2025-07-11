import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint to verify server status
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

export { router as healthRouter };