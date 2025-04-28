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

  // Detectar el directorio de código fuente principal
  let srcDir = 'src';
  try {
    const srcStats = await fs.stat(path.join(projectPath, 'src'));
    if (!srcStats.isDirectory()) {
      // Intentar encontrar otro directorio de código fuente común
      const dirs = await fs.readdir(projectPath, { withFileTypes: true });
      for (const dir of dirs) {
        if (dir.isDirectory() && ['source', 'app', 'lib'].includes(dir.name)) {
          srcDir = dir.name;
          break;
        }
      }
    }
  } catch (error) {
    console.error(
      "Advertencia: No se encontró el directorio 'src'. Usando directorio raíz del proyecto.",
    );
    srcDir = '';
  }

  // Analizar archivos y exportaciones no utilizadas
  console.error('Analizando archivos y exportaciones no utilizadas...');
  const madgeOptions = {
    baseDir: projectPath,
    excludeRegExp: [/\.(test|spec|d)\.tsx?$/],
  };

  // Encontrar archivos no utilizados con madge
  const madgeResult = await madge(path.join(projectPath, srcDir), madgeOptions);
  const unusedFiles = madgeResult.orphans().map(file => path.join(srcDir, file));

  // Analizar exportaciones no utilizadas
  const unusedExports: Record<string, string[]> = {};

  const dependencyGraph = madgeResult.obj();
  const files = Object.keys(dependencyGraph);

  // Análisis básico de exportaciones no utilizadas
  for (const file of files) {
    try {
      const fullPath = path.join(projectPath, file);
      // Verificar si el archivo existe antes de leerlo
      try {
        await fs.access(fullPath);
      } catch (e) {
        continue;
      }

      const content = await fs.readFile(fullPath, 'utf-8');

      // Extraer exportaciones (simplificado)
      const exportMatches =
        content.match(
          /export\s+(const|function|class|let|var|type|interface)\s+([a-zA-Z0-9_]+)/g,
        ) || [];
      const exports = exportMatches
        .map(e => {
          const match = e.match(
            /export\s+(const|function|class|let|var|type|interface)\s+([a-zA-Z0-9_]+)/,
          );
          return match ? match[2] : '';
        })
        .filter(Boolean);

      if (exports.length > 0) {
        // Verificar si estas exportaciones son importadas por otros archivos
        const usedExports = new Set<string>();

        // Comprobar si el archivo es importado por otros
        const isImported = Object.values(dependencyGraph).some(deps => deps.includes(file));

        // Si el archivo no es importado, todas sus exportaciones son no utilizadas
        if (!isImported) {
          unusedExports[file] = exports;
        }
      }
    } catch (error) {
      // Ignorar errores de procesamiento de archivos individuales
      console.error(`Error al procesar exportaciones en ${file}: ${error}`);
    }
  }

  // Devolver resultados
  return {
    unusedDependencies: Object.keys(depcheckResult.dependencies),
    unusedFiles,
    unusedExports,
  };
}
