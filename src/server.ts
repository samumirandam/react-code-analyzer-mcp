import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerPrompts } from './prompts/index.js';
import { registerResources } from './resources/index.js';
import { registerTools } from './tools/index.js';

// Crear instancia del servidor MCP
export const createServer = async () => {
  const server = new McpServer({
    name: 'React Code Analyzer',
    version: '1.0.1',
    capabilities: {
      resources: { listChanged: true },
      tools: { listChanged: true },
      prompts: { listChanged: true },
    },
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

  try {
    await server.connect(transport);
    console.error(
      'Servidor React Code Analyzer MCP iniciado con éxito y listo para recibir solicitudes.',
    );

    // Manejar cierre limpio
    const handleShutdown = async () => {
      console.error('Cerrando servidor MCP...');
      try {
        await server.close();
        console.error('Servidor MCP cerrado con éxito.');
      } catch (error) {
        console.error('Error al cerrar el servidor MCP:', error);
      }
      process.exit(0);
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);

    // También manejar eventos de error en el transporte
    transport.onerror = error => {
      console.error('Error en el transporte MCP:', error);
    };

    // Manejar cierre de conexión
    transport.onclose = () => {
      console.error('Conexión MCP cerrada.');
    };
  } catch (error) {
    console.error('Error al conectar el servidor MCP:', error);
    throw error;
  }
};
