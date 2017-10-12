"use strict";

/**
 * @export SOASTA
 *
 * @desc
 * Exports the [Repository API Class]{@link SOASTA} to access SOASTA Repository API from NodeJS
 */
exports.SOASTA = require("./lib/model/Repository");

//cheap and dirty way to see if we're in a node context
if(typeof window === "undefined")
{

  /**
   * @export cmd
   *
   * @desc
   * Exports the [Repository CLI API client]{@link cmd} to access the CLI application to interact from a shell with the Repository
   */
  exports.cmd = require("./cli/cmd").program;

  /**
   * @export CLI
   *
   * @desc
   * Exports the [CLI utility class]{@link CLI} to initialize the API for CLI use
   */
  exports.CLI = require("./cli/core");
}
