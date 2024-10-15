const { Client } = require('@notionhq/client');
const PDFDocument = require('pdfkit');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

// Initializes the Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_PORTFOLIO_DATABASE_ID; 

// Function to get the content of a page
async function fetchPageContent(pageId) {
    try {
        console.log(`Getting content of the page with ID: ${pageId}`);
        const response = await notion.blocks.children.list({ block_id: pageId });
        const blocks = response.results;

        let content = '';

        blocks.forEach(block => {
            if (block.type === 'heading_3') {
                const heading = block.heading_3.rich_text.map(text => text.plain_text).join('');
                content += `\n${heading}\n`;
            } else if (block.type === 'paragraph') {
                const paragraph = block.paragraph.rich_text.map(text => text.plain_text).join('');
                content += `${paragraph}\n\n`;
            } else if (block.type === 'bulleted_list_item') {
                const bullet = block.bulleted_list_item.rich_text.map(text => text.plain_text).join('');
                content += `• ${bullet}\n`;
            }
        });

        console.log(`Content obtained from page ${pageId}`);
        return content;
    } catch (error) {
        console.error('Error getting the content of the page:', error);
        return 'Could not get the content of this page.';
    }
}

// Step 1: Get data from Notion
async function fetchData() {
    try {
        console.log('Querying the database...');
        const response = await notion.databases.query({ database_id: DATABASE_ID });
        const articles = response.results;

        const groupedPages = {};

        for (const article of articles) {
            const functionalArea = article.properties['Functional Area']?.select?.name;
            const subFunction = article.properties['Sub-Function']?.multi_select || [];
            const pageId = article.id;
            // console.log(article.properties)

            // Correctly accesses the status
            const status = article.properties['Status']?.status?.name;
            console.log(`Status: ${status}`); // Adds this for debugging

            // Filters articles by status "Done"
            if (status === 'Done') {
                if (functionalArea) {
                    if (!groupedPages[functionalArea]) {
                        groupedPages[functionalArea] = {};
                    }

                    for (const subFunc of subFunction) {
                        const subFuncName = subFunc.name;
                        if (!groupedPages[functionalArea][subFuncName]) {
                            groupedPages[functionalArea][subFuncName] = [];
                        }

                        console.log(`Processing article: ${article.properties['Page'].title[0]?.text?.content || 'Untitled'}`);

                        const pageContent = await fetchPageContent(pageId);

                        // Adds the article to the group
                        groupedPages[functionalArea][subFuncName].push({
                            title: article.properties['Page'].title[0]?.text?.content || 'Untitled',
                            url: article.url,
                            content: pageContent,
                            public_url: article.public_url, 
                            function: article.properties['Functional Area'].select.name,
                            sub_function: subFuncName,
                            relevant_industries: article.properties['Relevant Industries']?.multi_select.map(industry => industry.name).join(', ') || 'N/A',
                            version_number: article.properties['Version Number']?.number || 'N/A',
                            guide_type: article.properties['Guide Type']?.select?.name || 'N/A'
                        });
                        
                        // console.log('Guide Type: ', article.properties.Page)

                        console.log(`Article processed: ${article.properties['Page'].title[0]?.text?.content || 'Untitled'}`);
                    }
                }
            } else {
                console.log(`Article omitted due to status not "Done": ${article.properties['Page'].title[0]?.text?.content || 'Untitled'}`);
            }
        }

        console.log('Database query completed.');
        return groupedPages;
    } catch (error) {
        console.error('Error querying the database:', error);
    }
}

// Step 3: Generate the PDF
function generatePDF(groupedPages) {
    const dir = './pdfs'; // Define the folder where the PDFs will be saved
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir); // Create the "pdfs" folder if it doesn't exist
        console.log(`Folder created: ${dir}`);
    }


    const doc = new PDFDocument();
    const outputPath = `${dir}/Playbook.pdf`; // Save the PDF inside the "pdfs" folder
    doc.pipe(fs.createWriteStream(outputPath));

    doc.fontSize(20).text('Playbook: Content Guides', { align: 'center' });
    doc.moveDown();

    for (const functionalArea in groupedPages) {
        doc.fontSize(16).text(functionalArea, { underline: true });
        doc.moveDown();

        for (const subFunction in groupedPages[functionalArea]) {
            doc.fontSize(14).text(subFunction, { bold: true });
            doc.moveDown();

            groupedPages[functionalArea][subFunction].forEach(article => {
                console.log(`Adding article to PDF: ${article.title}`);

                // Adds the article title in bold and as a link
                doc.fontSize(12).font('Helvetica-Bold').text(article.title, { link: article.url });
                doc.moveDown();

                // console.log(article)

                // Adds metadata
                doc.fontSize(10).font('Helvetica').text(`Functional Area: ${article.function}`);
                doc.fontSize(10).font('Helvetica').text(`Sub-Function: ${article.sub_function}`);
                doc.fontSize(10).font('Helvetica').text(`Relevant Industries: ${article.relevant_industries}`);
                doc.fontSize(10).font('Helvetica').text(`Version Number: ${article.version_number}`);
                doc.fontSize(10).font('Helvetica').text(`Guide Type: ${article.guide_type}`);
                doc.fontSize(10).text(`Link: ${article.public_url}`, { link: article.public_url });
                doc.moveDown();

                // Adds the article content
                doc.fontSize(10).text(article.content);
                doc.moveDown();

                // Adds a separator between articles
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown();
            });

            doc.moveDown();
        }
        doc.moveDown();
    }

    doc.end();
    console.log(`PDF generated: ${outputPath}`);
}

// Execute the process
(async () => {
    const groupedPages = await fetchData();
    if (groupedPages) {
        generatePDF(groupedPages);
    }
})();
