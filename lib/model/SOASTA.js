/**
 * @namespace SOASTA
 * @description
 * The SOASTA object inherits all functions from its member classes
 * This means that all functionality available in individual classes is also available from SOASTA via the
 * {@link Repository,Annotation,Timeline} class.
 */
var SOASTA = {
    Repository: require("./Repository.js"),
    Timeline: require("./Timeline.js"),
    Annotation: require("./Annotation.js")
};

module.exports = SOASTA;