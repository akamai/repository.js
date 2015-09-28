#!/usr/bin/env node
var program = require("./cli/cmd.js").program;
var fs = require("fs");

// go
program.parse(process.argv);
