import * as path from 'path';
import { Project, SyntaxKind } from 'ts-morph';

export interface ReactAntiPattern {
  type: string;
  file: string;
  line: number;
  column: number;
  description: string;
  severity: 'warning' | 'error';
  suggestion: string;
}

export async function findReactAntiPatterns(projectPath: string): Promise<ReactAntiPattern[]> {
  console.error(`Analizando anti-patrones React en: ${projectPath}`);

  // Crear proyecto ts-morph
  const project = new Project({
    tsConfigFilePath: path.join(projectPath, 'tsconfig.json'),
  });

  // Añadir archivos de origen al proyecto
  project.addSourceFilesAtPaths([
    path.join(projectPath, 'src/**/*.tsx'),
    path.join(projectPath, 'src/**/*.ts'),
  ]);

  const antiPatterns: ReactAntiPattern[] = [];

  // Buscar componentes React
  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) continue;

    // Detectar setStates o useStates anidados (anti-patrón)
    const functionCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    for (const call of functionCalls) {
      const expression = call.getExpression().getText();

      // Detectar setState en callback o dentro de otro setState/useState
      if (
        expression.includes('setState') ||
        (expression.includes('set') && /set[A-Z]/.test(expression))
      ) {
        // Verificar si está dentro de otro setState o useState
        const ancestors = call.getAncestors();
        for (const ancestor of ancestors) {
          if (ancestor.getKind() === SyntaxKind.CallExpression) {
            const ancestorExpression = ancestor.getChildAtIndex(0)?.getText();

            // Verificar si es una actualización de estado (setState o setAlgo de useState)
            if (
              ancestorExpression &&
              (ancestorExpression.includes('setState') ||
                (ancestorExpression.includes('set') && /set[A-Z]/.test(ancestorExpression)))
            ) {
              const position = call.getStart();
              const lineAndColumn = sourceFile.getLineAndColumnAtPos(position);

              antiPatterns.push({
                type: 'nested-state-updates',
                file: filePath.replace(projectPath, ''),
                line: lineAndColumn.line,
                column: lineAndColumn.column,
                description:
                  'Estado anidado detectado. Actualizar el estado dentro de otro actualizador de estado puede causar comportamientos inesperados.',
                severity: 'error',
                suggestion:
                  'Combina las actualizaciones de estado o usa useEffect para manejar actualizaciones secuenciales.',
              });
              break; // Evitar duplicados
            }
          }
        }
      }

      // Detectar useEffect sin dependencias
      if (expression.includes('useEffect')) {
        const args = call.getArguments();
        if (args.length < 2) {
          const position = call.getStart();
          const lineAndColumn = sourceFile.getLineAndColumnAtPos(position);

          antiPatterns.push({
            type: 'missing-dependencies',
            file: filePath.replace(projectPath, ''),
            line: lineAndColumn.line,
            column: lineAndColumn.column,
            description: 'useEffect sin array de dependencias detectado.',
            severity: 'warning',
            suggestion:
              'Añade un array de dependencias para evitar ejecuciones innecesarias del efecto.',
          });
        }
      }
    }
  }
  return antiPatterns;
}
