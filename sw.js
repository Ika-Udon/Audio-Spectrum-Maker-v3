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
  if (url.pathname !== VIRTUAL_URL) return;

  // OPTIONSプリフライト対応
  if (e.request.method === 'OPTIONS') {
    e.respondWith(new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      }
    }));
    return;
  }

  if (!projectData) {
    e.respondWith(new Response('No project data', { status: 404 }));
    return;
  }

  e.respondWith(new Response(projectData, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Content-Length': projectData.byteLength.toString(),
    }
  }));
});
