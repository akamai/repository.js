var program = require("commander");
var fs = require("fs");

program
    .version(JSON.parse(fs.readFileSync("./package.json", "utf-8")).version)
    .option("-u, --username <username>", "User name")
    .option("-p, --password <password>", "Password")
    .option("-t, --tenant <tenant>", "Tenant name")
    .option("-r, --repository <url>", "Repository URL")
    .option("-o, --output <file>", "Output file")
    .option("-v, --verbose", "Verbose debugging");

// commands
program.command("query <type>")
    .description("query objects")
    .action(require("./cli/query.js"));

// go
program.parse(process.argv);
