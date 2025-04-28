# React Code Analyzer MCP

Un servidor MCP (Model Context Protocol) especializado en análisis estático de código para proyectos React/TypeScript, diseñado para integrarse con Claude Desktop y proporcionar análisis avanzados de código.

## Características

- **Análisis de código no utilizado**: Identifica dependencias innecesarias, archivos y exportaciones no utilizadas
- **Detección de anti-patrones de React**: Identifica prácticas problemáticas como actualizaciones de estado anidadas y usos incorrectos de hooks
- **Análisis de estructura de proyectos**: Evalúa la organización de directorios y detecta dependencias circulares
- **Evaluación de cohesión de componentes**: Analiza la calidad y mantenibilidad de componentes React
- **Validación de estándares de código**: Verifica el cumplimiento de buenas prácticas de código mediante ESLint

## Instalación

No es necesario instalar la herramienta globalmente, puedes ejecutarla directamente mediante npx:

```bash
npx react-code-analyzer-mcp
```

## Configuración con Claude Desktop

1. Instala Claude Desktop desde [claude.ai/download](https://claude.ai/download)
2. Edita la configuración de Claude Desktop:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Añade la siguiente configuración:
```json
{
  "mcpServers": {
    "react-analyzer": {
      "command": "npx",
      "args": [
        "react-code-analyzer-mcp"
      ]
    }
  }
}
```

## Uso con Claude

Una vez configurado, puedes utilizar Claude Desktop para analizar proyectos React con este servidor MCP.

### Análisis Completo

```
Por favor, realiza un análisis completo del proyecto React en /ruta/a/mi/proyecto utilizando las herramientas disponibles.
```

### Refactorización de Componentes

```
Revisa el componente en /ruta/a/mi/proyecto/src/components/MiComponente.tsx y sugiere mejoras para su refactorización.
```

### Optimización de Dependencias

```
Ayúdame a optimizar las dependencias en mi proyecto /ruta/a/mi/proyecto, identificando paquetes innecesarios y alternativas más ligeras.
```

## Herramientas Disponibles

El servidor proporciona las siguientes herramientas que Claude puede usar para analizar tu código:

- **analyze-unused-code**: Detecta código no utilizado, dependencias innecesarias y exportaciones sin usar
- **analyze-react-anti-patterns**: Identifica patrones problemáticos en el código React como updates anidados y hooks mal implementados
- **analyze-project-structure**: Analiza la estructura del proyecto, identifica dependencias circulares y evalúa la cohesión de componentes
- **validate-code-standards**: Valida el cumplimiento de estándares de código usando ESLint con reglas personalizables

## Prompts Predefinidos

El servidor incluye los siguientes prompts predeterminados para facilitar el análisis:

- **full-code-analysis**: Realiza un análisis completo del código, incluyendo código no utilizado, anti-patrones, estructura y estándares
- **component-refactoring**: Proporciona sugerencias específicas para refactorizar un componente React
- **dependency-optimization**: Analiza las dependencias del proyecto y sugiere optimizaciones para mejorar rendimiento y mantenibilidad

## Recursos

Los recursos disponibles para Claude incluyen:

- **project-file**: Acceso a archivos específicos del proyecto
- **project-structure**: Obtención de la estructura completa del proyecto
- **package-json**: Acceso al archivo package.json del proyecto

## Requisitos del Sistema

- Node.js 18 o superior
- Proyecto React/TypeScript con estructura estándar
- Claude Desktop correctamente configurado

## Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un issue o un pull request con tus propuestas de mejora.

## Agradecimientos

Agradecimiento especial a [midudev](https://github.com/midudev) por su excelente curso sobre integración con Model Context Protocol. Si quieres aprender más sobre MCP, visita su [Curso Intensivo MCP](https://midu.dev/curso/intensivo-mcp).

## Licencia

Este proyecto está bajo la licencia MIT.