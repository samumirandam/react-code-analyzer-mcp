// src/analyzers/code-standards.ts
import { ESLint } from 'eslint';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface CodeStandardViolation {
  file: string;
  line: number;
  column: number;
  ruleId: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface CodeStandardsConfig {
  rules: Record<string, any>;
  customRules?: string[];
}

export async function validateCodeStandards(
  projectPath: string,
  config?: CodeStandardsConfig,
): Promise<CodeStandardViolation[]> {
  console.log(`Validando estándares de código en: ${projectPath}`);

  try {
    // Crear instancia de ESLint con opciones compatibles
    const eslint = new ESLint({
      overrideConfig: config?.rules ? { rules: config.rules } : undefined,
      cwd: projectPath,
    });

    // Encontrar archivos a analizar
    const filesToLint: string[] = [];

    async function scanDirectory(dir: string) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            if (
              entry.name !== 'node_modules' &&
              entry.name !== 'build' &&
              entry.name !== 'dist' &&
              entry.name !== '.next' &&
              !entry.name.startsWith('.')
            ) {
              await scanDirectory(fullPath);
            }
          } else if (entry.isFile()) {
            if (
              entry.name.endsWith('.ts') ||
              entry.name.endsWith('.tsx') ||
              entry.name.endsWith('.js') ||
              entry.name.endsWith('.jsx')
            ) {
              filesToLint.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.error(`Error escaneando el directorio ${dir}: ${error}`);
      }
    }

    // Escanear todo el proyecto, no solo src
    try {
      await scanDirectory(projectPath);
    } catch (error) {
      console.error(`Error al escanear el directorio principal: ${error}`);
    }

    // Ejecutar ESLint solo si encontramos archivos
    if (filesToLint.length === 0) {
      console.warn('No se encontraron archivos para analizar');
      return [];
    }

    try {
      // Ejecutar ESLint en los archivos encontrados
      const results = await eslint.lintFiles(filesToLint);

      // Convertir resultados al formato deseado
      const violations: CodeStandardViolation[] = [];

      for (const result of results) {
        for (const message of result.messages) {
          violations.push({
            file: path.relative(projectPath, result.filePath),
            line: message.line || 0,
            column: message.column || 0,
            ruleId: message.ruleId || 'unknown',
            message: message.message,
            severity: message.severity === 2 ? 'error' : 'warning',
          });
        }
      }

      return violations;
    } catch (error) {
      console.error(`Error al analizar los archivos: ${error}`);
      throw error;
    }
  } catch (error) {
    console.error(`Error al inicializar ESLint: ${error}`);
    throw new Error(`Error al validar estándares de código: ${error}`);
  }
}
