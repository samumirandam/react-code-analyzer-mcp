import { promises as fs } from 'fs';
import madge from 'madge';
import * as path from 'path';

export interface ProjectStructureAnalysis {
  directoryStructure: DirectoryNode;
  circularDependencies: string[][];
  componentCohesion: ComponentCohesionResult[];
}

interface DirectoryNode {
  name: string;
  type: 'directory' | 'file';
  children?: DirectoryNode[];
}

interface ComponentCohesionResult {
  component: string;
  cohesionScore: number; // 0-100, donde 100 es altamente cohesivo
  issues: string[];
}

async function buildDirectoryTree(dir: string, rootDir: string): Promise<DirectoryNode> {
  const name = path.basename(dir);
  const stats = await fs.stat(dir);

  if (!stats.isDirectory()) {
    return { name, type: 'file' };
  }

  const children: DirectoryNode[] = [];
  const entries = await fs.readdir(dir);

  for (const entry of entries) {
    if (entry === 'node_modules' || entry === 'build' || entry === 'dist') continue;

    const fullPath = path.join(dir, entry);
    try {
      const child = await buildDirectoryTree(fullPath, rootDir);
      children.push(child);
    } catch (error) {
      console.error(`Error al procesar ${fullPath}:`, error);
    }
  }

  return {
    name,
    type: 'directory',
    children,
  };
}

export async function analyzeProjectStructure(
  projectPath: string,
): Promise<ProjectStructureAnalysis> {
  console.error(`Analizando estructura del proyecto en: ${projectPath}`);

  // Crear árbol de directorios
  const directoryStructure = await buildDirectoryTree(projectPath, projectPath);

  // Encontrar dependencias circulares con madge
  const madgeOptions = {
    baseDir: projectPath,
    excludeRegExp: [/\.(test|spec|d)\.tsx?$/],
  };

  const madgeResult = await madge(path.join(projectPath, 'src'), madgeOptions);

  const circularDependencies = madgeResult.circular();

  // Analizar cohesión de componentes
  const componentCohesionResults: ComponentCohesionResult[] = [];

  const componentFiles = await findComponentFiles(projectPath);
  for (const file of componentFiles) {
    const cohesionResult = await analyzeCohesion(file, projectPath);
    componentCohesionResults.push(cohesionResult);
  }

  return {
    directoryStructure,
    circularDependencies,
    componentCohesion: componentCohesionResults,
  };
}

async function findComponentFiles(projectPath: string): Promise<string[]> {
  // Función auxiliar para encontrar archivos de componentes React
  const componentFiles: string[] = [];

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'build' && entry.name !== 'dist') {
          await scanDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
          // Comprobación simplificada - una implementación real verificaría si el archivo contiene un componente React
          componentFiles.push(fullPath.replace(projectPath, ''));
        }
      }
    }
  }

  await scanDirectory(projectPath);
  return componentFiles;
}

async function analyzeCohesion(
  componentFile: string,
  projectPath: string,
): Promise<ComponentCohesionResult> {
  const fullPath = path.join(projectPath, componentFile);
  let cohesionScore = 70; // Valor base
  const issues: string[] = [];

  try {
    const content = await fs.readFile(fullPath, 'utf-8');

    // Evaluar cohesión basada en heurísticas simples

    // 1. Verificar si el componente es demasiado largo
    const lines = content.split('\n').length;
    if (lines > 300) {
      cohesionScore -= 20;
      issues.push('Componente demasiado largo (más de 300 líneas)');
    } else if (lines > 200) {
      cohesionScore -= 10;
      issues.push('Componente largo (más de 200 líneas)');
    }

    // 2. Verificar si hay demasiados hooks
    const hookMatches = content.match(/use[A-Z][a-zA-Z]*/g) || [];
    const uniqueHooks = new Set(hookMatches);
    if (uniqueHooks.size > 7) {
      cohesionScore -= 15;
      issues.push(`Demasiados hooks diferentes (${uniqueHooks.size})`);
    }

    // 3. Verificar si hay muchos handlers de eventos
    const handlerMatches = content.match(/handle[A-Z][a-zA-Z]*/g) || [];
    if (handlerMatches.length > 10) {
      cohesionScore -= 15;
      issues.push(`Muchos handlers de eventos (${handlerMatches.length})`);
    }

    // Asegurar que la puntuación esté entre 0 y 100
    cohesionScore = Math.max(0, Math.min(100, cohesionScore));
  } catch (error) {
    cohesionScore = 50;
    issues.push(`Error al analizar el archivo: ${error}`);
  }

  return {
    component: componentFile,
    cohesionScore,
    issues,
  };
}
