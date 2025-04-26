import depcheck from 'depcheck';
import { promises as fs } from 'fs';
import madge from 'madge';
import * as path from 'path';

export interface UnusedCodeResult {
  unusedDependencies: string[];
  unusedFiles: string[];
  unusedExports: Record<string, string[]>;
}

export async function findUnusedCode(projectPath: string): Promise<UnusedCodeResult> {
  // Verificar que el directorio existe
  try {
    await fs.access(projectPath);
  } catch (error) {
    console.error('error:', error);
    throw new Error(`El directorio del proyecto no existe: ${projectPath}`);
  }

  // Analizar dependencias no utilizadas
  console.error(`Analizando dependencias no utilizadas en: ${projectPath}`);
  const depcheckOptions = {
    ignoreBinPackage: false,
    skipMissing: false,
    ignorePatterns: ['dist', 'build', 'node_modules', '*.test.ts', '*.test.tsx'],
  };

  const depcheckResult = await depcheck(projectPath, depcheckOptions);

  // Analizar archivos y exportaciones no utilizadas
  console.error('Analizando archivos y exportaciones no utilizadas...');
  const madgeOptions = {
    baseDir: projectPath,
    excludeRegExp: [/\.(test|spec|d)\.tsx?$/],
  };

  // Encontrar archivos no utilizados con madge
  const madgeResult = await madge(path.join(projectPath, 'src'), madgeOptions);
  const unusedFiles = madgeResult.orphans().map(file => path.join('src', file));

  // Como una simplificación, utilizamos una estructura ficticia para las exportaciones no utilizadas
  // En una implementación real, necesitaríamos analizar el AST con ts-morph o similar
  const unusedExports: Record<string, string[]> = {};

  // Devolver resultados
  return {
    unusedDependencies: Object.keys(depcheckResult.dependencies),
    unusedFiles,
    unusedExports,
  };
}
