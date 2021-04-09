#!/usr/bin/env node
var program = require("./cliTimeline/cmd.js").program;
var fs = require("fs");

// go
program().parse(process.argv);
