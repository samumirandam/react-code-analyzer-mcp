import { createServer, startServer } from './server.js';

async function main() {
  console.error('React Code Analyzer MCP v1.0.0');
  console.error('--------------------------------');

  try {
    const server = await createServer();
    await startServer(server);
  } catch (error) {
    console.error('Error al iniciar el servidor MCP:', error);
    process.exit(1);
  }
}

main();
