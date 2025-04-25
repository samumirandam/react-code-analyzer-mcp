import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Crear instancia del servidor MCP
export const createServer = async () => {
  const server = new McpServer({
    name: 'React Code Analyzer',
    version: '1.0.0',
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  });

  // Aquí se registrarán los recursos, herramientas y prompts

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

  // El servidor ahora escucha en stdin y responde en stdout
};
