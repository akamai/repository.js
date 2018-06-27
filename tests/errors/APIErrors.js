/* global describe,it */
var path = require("path"),
    chai = require("chai"),
    nock = require("nock");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "errors", "APIError.js");

var assert = chai.assert;

describe("APIError Tests", function() {

    function mockFunction(mockResponseObject, code) {
        var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "errors", "APIError.js");
        var APIError = require(REQUIRE_CLASS);
        throw new APIError("Request Failed!", mockResponseObject, code);
    }

    it("Should require without problems", function() {
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of APIError", function() {
        var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "errors", "APIError.js");
        var APIError = require(REQUIRE_CLASS);
        try {
            mockFunction(null, null);
        } catch (error) {
            assert.instanceOf(error, APIError);
            assert.instanceOf(error, Error);
            assert.isString(error.stack);
            assert.strictEqual("APIError: Request Failed!", error.toString());
            assert.strictEqual(error.stack.split("\n")[0], "APIError: Request Failed!");
            assert.strictEqual(error.stack.split("\n")[1].indexOf("mockFunction"), 7);
        }
    });
});
