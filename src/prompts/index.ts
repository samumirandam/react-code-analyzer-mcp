// src/prompts/index.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export async function registerPrompts(server: McpServer) {
  // Prompt para análisis completo de código
  server.prompt(
    'full-code-analysis',
    {
      projectPath: z.string().describe('Ruta absoluta al directorio del proyecto React/TypeScript'),
    },
    ({ projectPath }) => ({
      description: 'Análisis completo de un proyecto React/TypeScript',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Por favor, realiza un análisis completo del proyecto React/TypeScript ubicado en ${projectPath}. 
          
Necesito identificar:
1. Código no utilizado y dependencias innecesarias
2. Anti-patrones de React que podrían causar problemas de rendimiento o mantenimiento
3. Problemas en la estructura del proyecto y cohesión de componentes
4. Violaciones de estándares de código y mejores prácticas

Por favor, utiliza las herramientas de análisis disponibles y proporciona recomendaciones específicas para mejorar la calidad del código y la arquitectura del proyecto.`,
          },
        },
      ],
    }),
  );

  // Prompt para refactorización de componentes
  server.prompt(
    'component-refactoring',
    {
      projectPath: z.string().describe('Ruta absoluta al directorio del proyecto React/TypeScript'),
      componentPath: z.string().describe('Ruta relativa al componente React dentro del proyecto'),
    },
    ({ projectPath, componentPath }) => ({
      description: 'Sugerencias para refactorizar un componente React',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Por favor, analiza el componente React ubicado en ${componentPath} del proyecto en ${projectPath} y proporciona sugerencias para refactorizarlo.
          
Me gustaría:
1. Identificar oportunidades para mejorar la claridad y mantenibilidad del código
2. Detectar posibles problemas de rendimiento y anti-patrones de React
3. Sugerir una mejor estructura para la separación de responsabilidades
4. Recibir ejemplos de código refactorizado que implementen tus recomendaciones

Por favor, utiliza las herramientas de análisis disponibles y enfócate en proporcionar recomendaciones prácticas y específicas.`,
          },
        },
      ],
    }),
  );

  // Prompt para optimización de dependencias
  server.prompt(
    'dependency-optimization',
    {
      projectPath: z.string().describe('Ruta absoluta al directorio del proyecto React/TypeScript'),
    },
    ({ projectPath }) => ({
      description: 'Análisis y optimización de dependencias del proyecto',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Por favor, analiza las dependencias del proyecto React/TypeScript ubicado en ${projectPath} e identifica oportunidades para optimizarlas.
          
Necesito:
1. Una lista de dependencias no utilizadas que pueden ser eliminadas
2. Dependencias obsoletas o con vulnerabilidades conocidas
3. Dependencias que podrían reemplazarse por alternativas más ligeras o mantenidas
4. Recomendaciones para mejorar el rendimiento y reducir el tamaño del bundle

Por favor, utiliza las herramientas de análisis disponibles y proporciona recomendaciones específicas con ejemplos de comandos a ejecutar.`,
          },
        },
      ],
    }),
  );

  console.error('Prompts MCP registrados con éxito');
}
