import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { createServer as createViteServer } from 'vite';
import authPlugin from './src/plugins/auth.ts';
import authRoutes from './src/routes/auth.ts';
import panditRoutes from './src/routes/pandits.ts';
import serviceRoutes from './src/routes/services.ts';
import bookingRoutes from './src/routes/bookings.ts';

let __filename: string;
let __dirname: string;

try {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  __filename = (globalThis as any).__filename || '';
  __dirname = (globalThis as any).__dirname || process.cwd();
}

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  const PORT = 3000;

  // Plugins
  await fastify.register(fastifyCors);
  await fastify.register(fastifyCookie);
  await fastify.register(authPlugin);

  // API Routes
  fastify.get('/api/health', async () => {
    return { status: 'ok' };
  });

  // Register feature routes
  fastify.register(authRoutes, { prefix: '/api' });
  fastify.register(panditRoutes, { prefix: '/api' });
  fastify.register(serviceRoutes, { prefix: '/api' });
  fastify.register(bookingRoutes, { prefix: '/api' });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Use fastify to handle vite middleware
    fastify.addHook('onRequest', async (request, reply) => {
      const { raw: req } = request;
      const { raw: res } = reply;
      const url = req.url || '/';
      
      if (url.startsWith('/api')) return;

      // Let vite handle the request
      return new Promise<void>((resolve, reject) => {
        vite.middlewares(req, res, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    fastify.register(fastifyStatic, {
      root: distPath,
      prefix: '/',
    });

    fastify.setNotFoundHandler(async (request, reply) => {
      return reply.sendFile('index.html');
    });
  }

  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
