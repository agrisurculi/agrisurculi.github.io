import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// GitHub Pages resolves directory indexes. Match that behavior in local previews.
function archiveDirectoryIndexes(server) {
  const archiveRoot = fileURLToPath(new URL('./public/archive/', import.meta.url));
  server.middlewares.use((request, response, next) => {
    const url = new URL(request.url || '/', 'http://localhost');
    if (url.pathname.startsWith('/archive/')) {
      const relative = url.pathname.slice('/archive/'.length);
      const candidate = resolve(archiveRoot, relative, 'index.html');
      if (candidate.startsWith(archiveRoot + (archiveRoot.endsWith(sep) ? '' : sep)) && existsSync(candidate)) {
        request.url = url.pathname.replace(/\/$/, '') + '/index.html' + url.search;
      }
    }
    next();
  });
}

export default defineConfig({
  site: 'https://agrisurculi.github.io',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [{ name: 'archive-directory-indexes', configureServer: archiveDirectoryIndexes, configurePreviewServer: archiveDirectoryIndexes }],
  },
});
