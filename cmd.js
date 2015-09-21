#!/usr/bin/env node
var program = require("commander");
var fs = require("fs");

program
    .version(JSON.parse(fs.readFileSync("./package.json", "utf-8")).version)
    .option("-u, --username <username>", "User name")
    .option("-p, --password <password>", "Password")
    .option("-t, --tenant <tenant>", "Tenant name")
    .option("-r, --repository <url>", "Repository URL")
    .option("-j, --json", "Output as JSON")
    .option("-o, --output <file>", "Output file")
    .option("-v, --verbose", "Verbose debugging");

// commands
program.command("query <type>")
    .description("query objects")
    .action(require("./cli/query.js"));

program.command("delete <type> <id>")
    .description("delete objects")
    .action(require("./cli/delete.js"));

program.command("update <type> <id> <file>")
    .description("Update an object in the repository based on the JSON formatted data in a file")
    .action(require("./cli/update.js"));

// go
program.parse(process.argv);
