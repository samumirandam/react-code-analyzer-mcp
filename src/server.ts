import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerPrompts } from './prompts/index.js';
import { registerResources } from './resources/index.js';
import { registerTools } from './tools/index.js';

// Crear instancia del servidor MCP
export const createServer = async () => {
  const server = new McpServer({
    name: 'React Code Analyzer',
    version: '1.0.0',
  });

  // Registrar recursos, herramientas y prompts
  await registerResources(server);
  await registerTools(server);
  await registerPrompts(server);

  return server;
};

// Iniciar el servidor con transporte stdio
export const startServer = async (server: McpServer) => {
  console.error('Iniciando servidor React Code Analyzer MCP...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    'Servidor React Code Analyzer MCP iniciado con éxito y listo para recibir solicitudes.',
  );

  // Manejar cierre limpio
  process.on('SIGINT', async () => {
    console.error('Cerrando servidor MCP...');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('Cerrando servidor MCP...');
    await server.close();
    process.exit(0);
  });
};
