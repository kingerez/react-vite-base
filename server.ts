import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { ViteDevServer, createServer as createViteServer } from 'vite';
import { readFileSync } from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevMode = process.env.NODE_ENV === 'development';

const port = process.env.PORT || 3000;

async function createServer() {
  const app = express()

  let vite: ViteDevServer;
  if(isDevMode) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    
    app.use(vite.middlewares)
  }

  app.get('*', async (req, res) => {
    let template;
    let render;
    const url = req.originalUrl
    
    if(isDevMode) {
      template = readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );
      template = await vite.transformIndexHtml(url, template);
  
      render = (
        await vite.ssrLoadModule(`/src/main-server.tsx`)
      ).render;
    } else {
      template = readFileSync(
        path.resolve(__dirname, `dist/client/src/index.html`),
        'utf-8'
      );

      // @ts-ignore
      render = (await import('./dist/server/main-server.js'))
        .render;
    }

    const appHtml = await render(url);

    const html = template.replace('<!--ssr_outlet-->', appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
}

createServer();