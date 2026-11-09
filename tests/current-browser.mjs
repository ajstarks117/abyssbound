import {createServer} from 'vite';

const server = await createServer({server: {host: '127.0.0.1', port: 5180}});
await server.listen();
process.env.BASE_URL = server.resolvedUrls.local[0].replace(/\/$/, '');
try {
  for (const suite of ['dungeon', 'relic', 'campaign', 'polish', 'final-boss', 'stability', 'survivors', 'release']) {
    await import('./' + suite + '-browser.mjs');
  }
} finally {
  await server.close();
}
