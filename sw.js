// Service Worker: 仮想URLへのfetchをメモリ上のsb3データで返す

const VIRTUAL_URL = '/scratch-preview-project.sb3';
let projectData = null;

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'store') {
    projectData = e.data.data; // ArrayBuffer
  }
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname === VIRTUAL_URL) {
    if (!projectData) {
      e.respondWith(new Response('No project data', { status: 404 }));
      return;
    }
    e.respondWith(new Response(projectData, {
      headers: {
        'Content-Type': 'application/zip',
        'Access-Control-Allow-Origin': '*',
      }
    }));
  }
});
