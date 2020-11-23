"use strict";

// cheap and dirty way to see if we're in a web context
var logger;
if (typeof window !== "undefined" && window.console) {
    logger = window.console;
} else {
    var winston = require("winston");

    logger = winston.createLogger({
        levels: {
            emerg: 7,
            alert: 6,
            crit: 5,
            error: 4,
            warning: 3,
            notice: 2,
            info: 1,
            debug: 0
        },
        level: process.env.DEBUG ? "debug" : "info",
        transports: [
            new winston.transports.Console()
        ]
    });
}

module.exports = logger;