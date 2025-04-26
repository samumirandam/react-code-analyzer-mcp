// src/tools/index.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export async function registerTools(server: McpServer) {
  // Herramienta para detectar código no utilizado
  server.tool(
    'analyze-unused-code',
    'Tool to analyze unused code in a React/TypeScript project',
    {
      projectPath: z.string().describe('Ruta absoluta al directorio del proyecto React/TypeScript'),
    },
    async ({ projectPath }) => {
      try {
        const { findUnusedCode } = await import('../analyzers/unused-code.js');
        const result = await findUnusedCode(projectPath);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error al analizar código no utilizado: ${error}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Herramienta para detectar anti-patrones de React
  server.tool(
    'analyze-react-anti-patterns',
    'Tool to analyze React anti-patterns in a React/TypeScript project',
    {
      projectPath: z.string().describe('Ruta absoluta al directorio del proyecto React/TypeScript'),
    },
    async ({ projectPath }) => {
      try {
        const { findReactAntiPatterns } = await import('../analyzers/anti-patterns.js');
        const result = await findReactAntiPatterns(projectPath);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error al analizar anti-patrones React: ${error}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Herramienta para analizar estructura del proyecto
  server.tool(
    'analyze-project-structure',
    'Tool to analyze the structure of a React/TypeScript project',
    {
      projectPath: z.string().describe('Ruta absoluta al directorio del proyecto React/TypeScript'),
    },
    async ({ projectPath }) => {
      try {
        const { analyzeProjectStructure } = await import('../analyzers/project-structure.js');
        const result = await analyzeProjectStructure(projectPath);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error al analizar estructura del proyecto: ${error}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Herramienta para validar estándares de código
  server.tool(
    'validate-code-standards',
    'Tool to validate code standards in a React/TypeScript project',
    {
      projectPath: z.string().describe('Ruta absoluta al directorio del proyecto React/TypeScript'),
      rules: z.record(z.any()).optional().describe('Reglas ESLint personalizadas (opcional)'),
    },
    async ({ projectPath, rules }) => {
      try {
        const { validateCodeStandards } = await import('../analyzers/code-standards.js');
        const result = await validateCodeStandards(
          projectPath,
          // , { rules: rules || {} }
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error al validar estándares de código: ${error}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  console.error('Herramientas MCP registradas con éxito');
}
