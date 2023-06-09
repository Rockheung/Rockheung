const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require('fs');
// or
// import {NotionToMarkdown} from "notion-to-md";

const notion = new Client({
  auth: "secret_GDFHk1I1OmJqPsuv2X4VcI2MG5MYLGLZFfevruUgqDV",
});

// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });

(async () => {
  const mdFile = fs.createWriteStream('test-2.md');
  const mdblocks = await n2m.pageToMarkdown("0e26eee14f594bd8be1c2009544a6d7e");
  const mdString = n2m.toMarkdownString(mdblocks);
  mdFile.write(mdString.parent);
  mdFile.end();
})();
