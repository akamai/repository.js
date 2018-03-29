"use strict";

/**
 * @export SOASTA
 *
 * @desc
 * Exports the [Repository API Class]{@link SOASTA} to access SOASTA Repository API from NodeJS
 * Exports the [Annotation API Class]{@link SOASTA} to access SOASTA Repository API from NodeJS
 * Exports the [Timeline API Class]{@link SOASTA} to access SOASTA Repository API from NodeJS
 */
exports.SOASTA = require("./lib/model/SOASTA");

// cheap and dirty way to see if we're in a node context
if (typeof window === "undefined") {
    /**
    * @export cmd
    *
    * @desc
    * Exports the [Repository CLI API client]{@link cmd} to access the CLI application
    * to interact from a shell with the Repository
    */
    exports.cmd = require("./cli/cmd").program;

    /**
    * @export CLI
    *
    * @desc
    * Exports the [CLI utility class]{@link CLI} to initialize the API for CLI use
    */
    exports.CLI = require("./cli/core");

    /**
     * @export cmdAnnotation
     *
     * @desc
     * Exports the [Annotation CLI API client]{@link cmd} to access the CLI application
     * to interact from a shell with the Repository
     */
     exports.cmd = require("./cliAnnotation/cmd").program;

     /**
     * @export CLI
     *
     * @desc
     * Exports the [CLI utility class]{@link CLI} to initialize the API for CLI use
     */
     exports.CLI = require("./cliAnnotation/core");

     /**
      * @export cmdTimeline
      *
      * @desc
      * Exports the [Timeline CLI API client]{@link cmd} to access the CLI application
      * to interact from a shell with the Repository
      */
      exports.cmd = require("./cliTimeline/cmd").program;

      /**
      * @export CLI
      *
      * @desc
      * Exports the [CLI utility class]{@link CLI} to initialize the API for CLI use
      */
      exports.CLI = require("./cliTimeline/core");

}
