import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { promises as fs } from 'fs';
import * as path from 'path';

export async function registerResources(server: McpServer) {
  // Recurso para obtener un archivo específico del proyecto
  server.resource(
    'project-file',
    new ResourceTemplate('file://{projectPath}/{filePath}', { list: undefined }),
    async (uri, { projectPath, filePath }) => {
      try {
        const fullPath = path.join(projectPath.toString(), filePath.toString());
        const content = await fs.readFile(fullPath, 'utf-8');

        return {
          contents: [
            {
              uri: uri.href,
              text: content,
              mimeType: getFileMimeType(filePath.toString()),
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: uri.href,
              text: `Error al leer el archivo: ${error}`,
              mimeType: 'text/plain',
            },
          ],
        };
      }
    },
  );

  // Recurso para obtener la estructura del proyecto
  server.resource(
    'project-structure',
    new ResourceTemplate('structure://{projectPath}', { list: undefined }),
    async (uri, { projectPath }) => {
      try {
        const { analyzeProjectStructure } = await import('../analyzers/project-structure.js');
        const structure = await analyzeProjectStructure(projectPath.toString());

        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(structure, null, 2),
              mimeType: 'application/json',
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: uri.href,
              text: `Error al analizar la estructura del proyecto: ${error}`,
              mimeType: 'text/plain',
            },
          ],
        };
      }
    },
  );

  // Recurso para obtener el package.json del proyecto
  server.resource(
    'package-json',
    new ResourceTemplate('package://{projectPath}', { list: undefined }),
    async (uri, { projectPath }) => {
      try {
        const packageJsonPath = path.join(projectPath.toString(), 'package.json');
        const packageJson = await fs.readFile(packageJsonPath, 'utf-8');

        return {
          contents: [
            {
              uri: uri.href,
              text: packageJson,
              mimeType: 'application/json',
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: uri.href,
              text: `Error al leer package.json: ${error}`,
              mimeType: 'text/plain',
            },
          ],
        };
      }
    },
  );

  console.error('Recursos MCP registrados con éxito');
}

// Función auxiliar para determinar el tipo MIME basado en la extensión del archivo
function getFileMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'application/typescript';
    case '.js':
    case '.jsx':
      return 'application/javascript';
    case '.json':
      return 'application/json';
    case '.css':
      return 'text/css';
    case '.html':
      return 'text/html';
    case '.md':
      return 'text/markdown';
    default:
      return 'text/plain';
  }
}
