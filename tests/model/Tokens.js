/* global describe,it*/
var path = require("path"),
    chai = require("chai"),
    nock = require("nock");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "model", "Tokens.js");
var REQUIRE_CONSTANTS = path.join(__dirname, "..", "..", "lib", "constants.js");

var constants = require(REQUIRE_CONSTANTS);
var Tokens = require(REQUIRE_CLASS);

var assert = chai.assert;

describe("Tokens Tests", function() {
    it("Should require without problems", function() {
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of SOASTA.Repository", function() {
        var expect = "http://mpulse.soasta.com/concerto/services/rest/RepositoryService/v1/Tokens";
        var tokens = new Tokens(constants.REPOSITORY_URL);

        assert.instanceOf(tokens, Tokens);
        assert.strictEqual(tokens.endpoint, expect);
    });

    describe("connect", function() {
        it("Should recieve a mocked AuthToken on connect", function(done) {
            var token_expected = { token: "1" },
                tenantname = "soasta",
                username = "soasta",
                password = "password";

            var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .reply(200,  function(uri, requestBodyObject) {
                    assert.strictEqual(requestBodyObject.userName, username);
                    assert.strictEqual(requestBodyObject.password, password);

                    return token_expected;
                });

            var tokens = new Tokens(constants.REPOSITORY_URL);

            tokens.connect(tenantname, username, password, function(error, token) {
                assert.strictEqual(token, token_expected.token);
                assert.isNull(error);
                done();
            });
        });
    });

    describe("getToken", function() {
        it("Should retrieve a Token successfully and return it as object", function(done) {
            var expect = { a: 1, b:2, c:3 };
            var id = "sdadas-fsd-sdf-sdfg";

            var tokensAPI = nock("http://mpulse.soasta.com")
                .get("/concerto/services/rest/RepositoryService/v1/Tokens/" + id)
                .reply(200, function(uri, requestBody) {
                    assert.strictEqual(this.req.headers["x-source"], "script");
                    return expect;
                });

            var tokens = new Tokens(constants.REPOSITORY_URL, "script");
            tokens.getToken(id, function(error, result) {
                assert.isUndefined(error);
                assert.deepEqual(result, expect);

                done();
            });
        });

        it("Should try to get a Token but fail", function(done) {
            var id = "sdadas-fsd-sdf-sdfg";
            var expect = { message: "Error", code: 500 };
            var tokensAPI = nock("http://mpulse.soasta.com")
                .get("/concerto/services/rest/RepositoryService/v1/Tokens/" + id)
                .replyWithError(expect, function(uri, requestBody) {
                    return requestBody;
                });

            var tokens = new Tokens(constants.REPOSITORY_URL);
            tokens.getToken(id, function(error, result) {
                assert.isUndefined(result);
                assert.deepEqual(error, expect);

                done();
            });
        });
    });

    describe("disconnect", function() {
        it("Should call disconnect with DELETE", function(done) {
            var token_expected = { token: "1" },
                tenantname = "soasta",
                username = "soasta",
                password = "password";

            var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .reply(200,  function(uri, requestBodyObject) {
                    assert.strictEqual(requestBodyObject.userName, username);
                    assert.strictEqual(requestBodyObject.password, password);

                    return token_expected;
                })
                .delete("/concerto/services/rest/RepositoryService/v1/Tokens")
                .reply(200,  function(uri, requestBody) {
                    assert.strictEqual(this.req.headers["x-auth-token"], 1);
                    return null;
                });

            var tokens = new Tokens(constants.REPOSITORY_URL);

            tokens.connect(tenantname, username, password, function(error, token) {
                assert.isNull(error);
                assert.strictEqual(token, token_expected.token);

                tokens.disconnect(token, function() {
                    assert.isNull(error);
                    done();
                });
            });
        });
    });
});
