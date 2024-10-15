# Notion Database to PDF Generator

This script allows you to query a Notion database and generate a PDF file that contains all the articles filtered by the "Functional Area" field and their completion status (`Done`). It is designed to facilitate the extraction of useful articles from Notion and generate a consolidated document.

#### Features

- **Connection to Notion**: It uses the Notion API to query the database defined in the `.env` file.
- **Filtering by "Status"**: Only articles whose "Status" is `Done` are included. Other articles are omitted.
- **Grouping by "Functional Area" and "Sub-Function"**: Articles are grouped in the PDF by these properties, showing an organized structure.
- **Content Extraction**: The content of each page is obtained, including titles, paragraphs, and bulleted lists.
- **PDF Generation**: It creates a PDF with the filtered articles, including metadata such as relevant industries, version number, and guide type.
- **Link Support**: Articles and sections contain links that redirect to the original pages in Notion.

#### Dependencies

- `@notionhq/client`: Node.js client to connect to the Notion API.
- `pdfkit`: Library to generate PDF files.
- `dotenv`: To manage environment variables.
- `fs`: Native Node.js module to handle the file system.

## Scripts

### 1. **Database Query**
   - This script interacts with the Notion API to extract the articles from the database. The results can be filtered by different criteria, such as "Functional Area" and article status (`Done`).
  
- **Script Execution**:
   ```bash
   npm run queryfiles

### 2. **Query a Specific Page (optional)**
  - This script connects to the Notion API to query a specific page and display its content in the console. 

- **Script Execution**:
   ```bash
   npm run page

### 3. **PDF Generation**
   - Once the articles from the database have been queried and filtered, this script generates a PDF file that consolidates and presents them in an organized manner.

- **Script Execution**:
   ```bash
   npm run generate
## Commands
Here are the main commands you can use to execute the scripts:
- **Install Dependencies**:
   ```bash
   npm install