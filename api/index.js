import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import the compiled server
const { createHttpServer } = require('../dist/index.cjs');

let server;

export default async (req, res) => {
  if (!server) {
    server = await createHttpServer();
  }
  server(req, res);
};
