# Notion Database to PDF Generator

Este script permite consultar una base de datos en Notion y generar un archivo PDF que contiene todos los artículos filtrados por el campo "Functional Area" y su estado de completado (`Done`). Está diseñado para facilitar la extracción de artículos útiles de Notion y generar un documento consolidado.

#### Funcionalidades

- **Conexión con Notion**: Utiliza la API de Notion para consultar la base de datos definida en el archivo `.env`.
- **Filtrado por "Status"**: Solo se incluyen los artículos cuyo "Status" es `Done`. Los demás artículos son omitidos.
- **Agrupación por "Functional Area" y "Sub-Function"**: Los artículos se agrupan en el PDF por estas propiedades, mostrando una estructura organizada.
- **Extracción del contenido**: Se obtiene el contenido de cada página, incluyendo títulos, párrafos y listas con viñetas.
- **Generación del PDF**: Crea un PDF con los artículos filtrados, incluyendo metadatos como industrias relevantes, número de versión y tipo de guía.
- **Soporte de enlaces**: Los artículos y secciones contienen enlaces que redirigen a las páginas originales en Notion.

#### Dependencias

- `@notionhq/client`: Cliente de Node.js para conectarse a la API de Notion.
- `pdfkit`: Biblioteca para generar archivos PDF.
- `dotenv`: Para gestionar variables de entorno.
- `fs`: Módulo nativo de Node.js para manejar el sistema de archivos.

## Scripts

### 1. **Consulta de la base de datos**
   - Este script interactúa con la API de Notion para extraer los artículos de la base de datos. Los resultados pueden ser filtrados por diferentes criterios, como "Functional Area" y estado del artículo (`Done`).
  
- **Ejecucion del script**:
   ```bash
   npm run queryfiles

### 2. **Consulta de una pagina en especifico(opcional)**
  - Este script se conecta a la API de Notion para consultar una página específica y mostrar su contenido en la consola. 

- **Ejecucion del script**:
   ```bash
   npm run page

### 3. **Generación del PDF**
   - Una vez que se han consultado y filtrado los artículos de la base de datos, este script genera un archivo PDF que los consolida y los presenta de manera ordenada.

- **Ejecucion del script**:
   ```bash
   npm run generate
## Comandos
Aquí te dejamos los comandos principales que puedes utilizar para ejecutar los scripts:
- **Instalar dependencias**:
   ```bash
   npm install
ll