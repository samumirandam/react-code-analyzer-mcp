# React Code Analyzer MCP

Un servidor MCP especializado en análisis estático de código para proyectos React/TypeScript.

## Características

- **Detector de código no utilizado y dependencias innecesarias**
- **Identificador de anti-patrones específicos de React**
- **Analizador de estructura de proyectos y cohesión de componentes**
- **Validador de estándares de código personalizados**

## Instalación

```bash
npm install -g react-code-analyzer-mcp
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
      "command": "react-code-analyzer-mcp"
    }
  }
}
```

## Uso con Claude

1. Inicia Claude Desktop
2. Puedes usar los siguientes prompts para analizar tus proyectos:

### Análisis Completo
```
Por favor, analiza mi proyecto React en /ruta/a/mi/proyecto utilizando las herramientas disponibles.
```

### Refactorización de Componentes
```
Revisa el componente en /ruta/a/mi/proyecto/src/components/MiComponente.tsx y sugiere mejoras.
```

### Optimización de Dependencias
```
Ayúdame a optimizar las dependencias en mi proyecto /ruta/a/mi/proyecto.
```

## Herramientas Disponibles

- `analyze-unused-code`: Detecta código no utilizado y dependencias innecesarias
- `analyze-react-anti-patterns`: Identifica anti-patrones en React
- `analyze-project-structure`: Analiza la estructura del proyecto
- `validate-code-standards`: Valida estándares de código personalizados

## Prompts Predefinidos

- `full-code-analysis`: Análisis completo de código
- `component-refactoring`: Sugerencias para refactorizar componentes
- `dependency-optimization`: Análisis y optimización de dependencias

## Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un issue o un pull request.

## Licencia

MIT