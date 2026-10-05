const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

// Live reload clients
const clients = new Set();

const liveReloadScript = `
<!-- Gotx Live Reload Script -->
<script>
  (() => {
    try {
      const es = new EventSource('/__livereload');
      es.onmessage = (event) => {
        if (event.data === 'reload') {
          console.log('[Gotx Server] Reloading page...');
          window.location.reload();
        }
      };
    } catch (e) {
      console.warn('[Gotx Server] Live reload inactive');
    }
  })();
</script>
`;

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function notifyClients() {
  for (const res of clients) {
    res.write('data: reload\n\n');
  }
}

// Watch directory for changes (debounced)
let reloadTimeout = null;
try {
  fs.watch(ROOT_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    if (filename.includes('node_modules') || filename.includes('.git') || filename.endsWith('.log')) return;
    clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(() => {
      console.log(`[Gotx Server] File changed (${filename}), refreshing...`);
      notifyClients();
    }, 120);
  });
} catch (err) {
  console.warn('[Gotx Server] fs.watch error:', err.message);
}

function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  // SSE Live Reload Endpoint
  if (pathname === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(': connected\n\n');
    clients.add(res);

    req.on('close', () => {
      clients.delete(res);
    });
    return;
  }

  // Prevent directory traversal
  let safePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if directory, default to index.html
  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    safePath = path.join(safePath, 'index.html');
  }

  // If path doesn't exist, try appending .html (e.g. /menu -> /menu.html)
  if (!fs.existsSync(safePath) && fs.existsSync(safePath + '.html')) {
    safePath = safePath + '.html';
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>404 - Page Not Found</title>
          <style>
            body { font-family: sans-serif; background: #120919; color: #fff; text-align: center; padding: 4rem 1rem; }
            h1 { font-size: 3rem; color: #D4AF37; margin-bottom: 0.5rem; }
            p { font-size: 1.2rem; color: #d0c7d8; }
            a { color: #F59E1B; text-decoration: none; font-weight: bold; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>404</h1>
          <p>Requested page <code>${pathname}</code> was not found.</p>
          <p><a href="/">Return to Gotx Coffee Home &rarr;</a></p>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html') {
      fs.readFile(safePath, 'utf8', (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }

        // Inject live reload snippet right before </body>
        let modified = content;
        if (modified.includes('</body>')) {
          modified = modified.replace('</body>', `${liveReloadScript}\n</body>`);
        } else {
          modified += liveReloadScript;
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(modified);
      });
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Content-Length': stats.size
      });
      fs.createReadStream(safePath).pipe(res);
    }
  });
}

function startServer(port) {
  const server = http.createServer(handleRequest);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[Gotx Server] Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[Gotx Server] Server error:', err);
    }
  });

  server.listen(port, () => {
    const localUrl = `http://localhost:${port}`;
    const networkUrl = `http://${getLocalIp()}:${port}`;

    console.log('\n☕ ═══════════════════════════════════════════════════════════');
    console.log(`   Gotx Coffee Frontend Server is running!`);
    console.log(`   ➜ Local:   ${localUrl}`);
    console.log(`   ➜ Network: ${networkUrl}`);
    console.log(`   ➜ Live reload enabled`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Automatically open browser on Windows
    const startCmd = process.platform === 'win32' ? `start ${localUrl}` : process.platform === 'darwin' ? `open ${localUrl}` : `xdg-open ${localUrl}`;
    exec(startCmd, () => {});
  });
}

startServer(PORT);
