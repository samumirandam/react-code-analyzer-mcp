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
  // config?: CodeStandardsConfig,
): Promise<CodeStandardViolation[]> {
  console.error(`Validando estándares de código en: ${projectPath}`);

  // Configuración por defecto de ESLint para React/TypeScript
  // const defaultConfig = {
  //   parser: '@typescript-eslint/parser',
  //   plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  //   extends: [
  //     'eslint:recommended',
  //     'plugin:@typescript-eslint/recommended',
  //     'plugin:react/recommended',
  //     'plugin:react-hooks/recommended',
  //   ],
  //   rules: {
  //     'react/prop-types': 'off',
  //     'react/react-in-jsx-scope': 'off',
  //     'react-hooks/rules-of-hooks': 'error',
  //     'react-hooks/exhaustive-deps': 'warn',
  //     '@typescript-eslint/explicit-function-return-type': 'off',
  //     '@typescript-eslint/no-explicit-any': 'warn',
  //     ...(config?.rules || {}),
  //   },
  // };

  // Crear instancia de ESLint
  const eslint = new ESLint({
    // baseConfig: defaultConfig,
    // useEslintrc: false,
    // extensions: ['.ts', '.tsx', '.js', '.jsx'],
  });

  // Encontrar archivos a analizar
  const filesToLint: string[] = [];

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'build' && entry.name !== 'dist') {
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
  }

  await scanDirectory(path.join(projectPath, 'src'));

  // Ejecutar ESLint en los archivos encontrados
  const results = await eslint.lintFiles(filesToLint);

  // Convertir resultados al formato deseado
  const violations: CodeStandardViolation[] = [];

  for (const result of results) {
    for (const message of result.messages) {
      violations.push({
        file: result.filePath.replace(projectPath, ''),
        line: message.line || 0,
        column: message.column || 0,
        ruleId: message.ruleId || 'unknown',
        message: message.message,
        severity: message.severity === 2 ? 'error' : 'warning',
      });
    }
  }

  return violations;
}
