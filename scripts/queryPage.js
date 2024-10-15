const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');
dotenv.config();

// Initializes the Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// ID of the page we want to query
const PAGE_ID = 'your_page_id_to_query'; 

// Function to fetch and display the page content
async function fetchPageContent() {
    try {
        // Fetches the blocks (content) of the page
        const response = await notion.blocks.children.list({ block_id: PAGE_ID });

        // Display the result in the console for verification
        console.log(' ---->title', response.results)
        console.log(' ----> sub_title:', response.results[0]);
        console.log(' ----> sub_title:', response.results[0].heading_3.rich_text[0].text.content);



            // Optional: Display the content in a more readable format
        response.results.forEach(block => {
            if (block.type === 'paragraph') {
                const text = block.paragraph.text.map(text => text.plain_text).join('');
                console.log('Paragraph:', text);
            } else if (block.type === 'heading_1') {
                const heading = block.heading_1.text.map(text => text.plain_text).join('');
                console.log('Heading 1:', heading);
            }
            // Add more block types as needed (heading_2, heading_3, etc.)
        });
    } catch (error) {
        console.error('Error fetching the page content:', error);
    }
}

// Execute the function to fetch the page content
fetchPageContent();
