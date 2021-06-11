#!/usr/bin/env node
var program = require("./cliAnnotation/cmd.js").program;
var fs = require("fs");

// go
program().parse(process.argv);
