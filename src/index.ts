#!/usr/bin/env node
import { createServer, startServer } from './server.js';

async function main() {
  console.error('React Code Analyzer MCP v1.0.2');
  console.error('--------------------------------');

  try {
    const server = await createServer();
    await startServer(server);
  } catch (error) {
    console.error('Error al iniciar el servidor MCP:', error);
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa no capturada rechazada:', promise, 'razón:', reason);
  // No cerramos el proceso para permitir que continúe funcionando
});

process.on('uncaughtException', error => {
  console.error('Excepción no capturada:', error);
  // Cerramos el proceso porque puede estar en un estado inconsistente
  process.exit(1);
});

main();
