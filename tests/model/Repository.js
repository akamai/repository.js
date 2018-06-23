/*global describe,it*/
var path = require("path"),
    chai = require("chai"),
    nock = require("nock"),
    q = require("q");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "model", "Repository.js");
var REQUIRE_CONSTANTS = path.join(__dirname, "..", "..", "lib", "constants.js");

var constants = require(REQUIRE_CONSTANTS);
var Repository = require(REQUIRE_CLASS);

var assert = chai.assert;

describe("Repository Tests", function(){
    it("Should require without problems", function(){
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of SOASTA.Repository", function(){
        var repository = new Repository(constants.REPOSITORY_URL);

        assert.instanceOf(repository, Repository);
    });

    it("Should return an error in the callback on connect", function(done){
        var token_expected = { token: "1" },
            tenantname = "doesnotexist",
            username = "doesnotexist",
            password = "doesnotexist",
            expect = { code: 401, message: 'Unauthorized' };

        var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .replyWithError(expect);

        var repository = new Repository(constants.REPOSITORY_URL);

        repository.connect(tenantname, username, password, function(error, result) {
            assert.deepEqual(error, expect);
            assert.isNull(result);
            done();
        });
    });

    it("Should create a promise based version of Repository API", function(done){
        var token_expected = { token: "1" },
            tenantname = "soasta",
            username = "soasta",
            password = "password";

        var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .reply(200,  function(uri, requestBody) {
                    var requestBodyObject = JSON.parse(requestBody);

                    assert.strictEqual(requestBodyObject.userName, username);
                    assert.strictEqual(requestBodyObject.password, password);
                    return token_expected;
                });

        var repository = new Repository(constants.REPOSITORY_URL);
        repository = repository.asPromises(q);

        repository.connect(tenantname, username, password).then(function(error) {
            done();
        });
    });

    it("Should return an instance of Repository as a promise and connect with promises", function(done){
        var token_expected = { token: "1" },
            tenantname = "soasta",
            username = "soasta",
            password = "password";

        var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .reply(200,  function(uri, requestBody) {
                    var requestBodyObject = JSON.parse(requestBody);

                    assert.strictEqual(requestBodyObject.userName, username);
                    assert.strictEqual(requestBodyObject.password, password);
                    return token_expected;
                });

        var repository = new Repository(constants.REPOSITORY_URL);
        var promiseRepo = repository.asPromises(q);

        promiseRepo.connect(tenantname, username, password).then(function(result) {
            assert.strictEqual(promiseRepo.token, token_expected.token);
            done();
        });
    });

    it("Should return an error on connect and catch in promise", function(done){
        var token_expected = { token: "1" },
            tenantname = "doesnotexist",
            username = "doesnotexist",
            password = "doesnotexist",
            expect = { code: 401, message: 'Unauthorized' };

        var repositoryAPI = nock("http://mpulse.soasta.com")
                .put("/concerto/services/rest/RepositoryService/v1/Tokens")
                .replyWithError(expect);

        var repository = new Repository(constants.REPOSITORY_URL);
        var promiseRepo = repository.asPromises(q);

        promiseRepo.connect(tenantname, username, password)
            .then(function() {
                assert.fail("Should not have resolved");
            })
            .catch(function(error) {
                assert.deepEqual(error, expect);
                done();
            });
    });

});
