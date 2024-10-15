const { APIErrorCode } = require("@notionhq/client");
const { Client } = require("@notionhq/client");
require('dotenv').config();

        // Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

        // List of Users
// (async () => {
//     try {
//       const listUsersResponse = await notion.users.list({});
//       console.log("Users:", listUsersResponse);
//     } catch (error) {
//       console.error("Error users list:", error);
//     }
// })();

        // Query to the database
(async () => {
  try {
    const databaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID;
    console.log('➡ database id:', databaseId)
    const response = await notion.databases.query({
        database_id: databaseId,
        // database_id: "10ab5f97-a125-8052-82e5-fa670ea6a475",
        // filter: {
        //     property: "Landmark",
        //     rich_text: {
        //     contains: "Bridge",
        //     },
        // },
    });
    console.log(response);
  } catch (error) {
    if (error.code === APIErrorCode.ObjectNotFound) {
      console.log("The database was not found.");
    } else {
      console.error("Another error:", error);
    }
  }
})();