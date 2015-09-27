/*global describe,it*/
var path = require("path"),
    chai = require("chai"),
    nock = require("nock");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "model", "Objects.js");
var REQUIRE_CONSTANTS = path.join(__dirname, "..", "..", "lib", "constants.js");

var assert = chai.assert;

describe("Objects Tests", function(){
    it("Should require without problems", function(){
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of SOASTA.Repository", function(){
        var expect = "/Objects";
        var Objects = require(REQUIRE_CLASS);
        var objects = new Objects("");

        assert.instanceOf(objects, Objects);
        assert.strictEqual(objects.endpoint, expect);
    });

    describe("createObject():", function() {
        it("Should create object successfully and return an ID", function(done){
            var properties = { a: 1, b:2 , c:3 };
            var expect = 1;
            var objectsUrlAppend = "/Objects";

            var objectsAPI = nock("http://mpulse.soasta.com")
                    .put("/concerto/services/rest/RepositoryService/v1/Objects")
                    .reply(200,  function(uri, requestBody) {
                        var requestBodyObject = JSON.parse(requestBody);

                        assert.deepEqual(properties, requestBodyObject);
                        return { id: expect };
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.createObject(1, properties, function(error, result) {
                assert.isNull(error);
                assert.deepEqual(result, expect);

                done();
            });
        });

        it("Should try to create object but fail", function(done){
            var objectsUrlAppend = "/Objects";
            var properties = { a: 1, b:2 , c:3 };
            var expect = { message: "Error", code: 500 };
            var objectsAPI = nock("http://mpulse.soasta.com")
                    .put("/concerto/services/rest/RepositoryService/v1/Objects")
                    .replyWithError(expect, function(uri, requestBody) {
                        var requestBodyObject = JSON.parse(requestBody);

                        assert.deepEqual(properties, requestBodyObject);
                        return expect;
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.createObject(1, properties, function(error, result) {
                assert.deepEqual(error, expect);
                done();
            });
        });
    });

    // getObjectByID Tests

    describe("getObjectByID():", function() {
        it("Should retrieve an Object successfully and return it as object", function(done){
            var expect = { a: 1, b:2 , c:3 };
            var objectsUrlAppend = "/Objects";
            var id = 1;
            var type = "domain";

            var objectsAPI = nock("http://mpulse.soasta.com")
                    .get("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/" + id)
                    .reply(200, function(uri, requestBody) {
                        assert.strictEqual(this.req.headers["x-auth-token"], 1);
                        return expect;
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.getObjectByID(1, type, 1, function(error, result) {
                assert.isNull(error);
                assert.deepEqual(result, expect);

                done();
            });
        });

        it("Should try to get an object by ID but fail", function(done){
            var objectsUrlAppend = "/Objects";
            var id = 1;
            var type = "domain";
            var expect = { message: "Error", code: 500 };
            var objectsAPI = nock("http://mpulse.soasta.com")
                    .get("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/" + id)
                    .replyWithError(expect, function(uri, requestBody) {
                        assert.strictEqual(this.req.headers["x-auth-token"], 1);
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.getObjectByID(1, type, 1, function(error, result) {
                assert.deepEqual(error, expect);
                done();
            });
        });
    });

    describe("queryObjects", function() {
        it("Should retrieve a list of Objects matching properties", function(done){
            var expect = { objects: [{ a: 1, b: 2, c: 3 }] };
            var objectsUrlAppend = "/Objects";
            var type = "domain";
            var query = { a: 1, c: 3};
            var objectsAPI = nock("http://mpulse.soasta.com")
                    .get("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/?a=1&c=3")
                    .reply(200, function() {
                        assert.strictEqual(this.req.headers["x-auth-token"], 1);
                        return expect;
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.queryObjects(1, type, query, function(error, result) {
                assert.isNull(error);
                assert.deepEqual(result, expect);
                done();
            });
        });

        it("Should try to query but fail when returned a failure", function(done){
            var objectsUrlAppend = "/Objects";
            var type = "domain";
            var query = { a: 1, c: 3};
            var error = {code: 500, message: "Failed"};
            var objectsAPI = nock("http://mpulse.soasta.com")
                    .get("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/?a=1&c=3")
                    .replyWithError(error, function() {
                        assert.strictEqual(this.req.headers["x-auth-token"], 1);
                        return expect;
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.queryObjects(1, type, query, function(err, result) {
                assert.isUndefined(result);
                assert.deepEqual(error, err);
                done();
            });
        });
    });

    describe("updateObject", function () {
        it("Should update object with properties at ID", function(done){
            var type = "domain";
            var id = 1;
            var token = 1;
            var update = {
                references: [{
                    id: 1
                }]
            };
            var data = {
                name: "fooo",
                id: id,
                references: [{
                    id: 0
                }]
            };

            var objectsAPI = nock("http://mpulse.soasta.com")
                    .post("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/" + id)
                    .reply(200, function(){
                        assert.strictEqual(this.req.headers["x-auth-token"], token);
                        data.references.push(update.references[0]);
                        return data;
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.updateObject(token, type, id, update, function(err, result){
                assert.deepEqual(update.references[0], result.references[1]);
                done();
            });
        });

        it("Should fail with an error when updating the object", function(done){
            var type = "domain";
            var id = 1;
            var token = 1;
            var error = {
                message: "failed",
                code: 400
            };
            var update = {
                references: [{
                    id: 1
                }]
            };
            var data = {
                name: "fooo",
                id: id,
                references: [{
                    id: 0
                }]
            };
            var objectsAPI = nock("http://mpulse.soasta.com")
                    .post("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/" + id)
                    .replyWithError(error, function(){
                        assert.strictEqual(this.req.headers["x-auth-token"], token);
                    });
            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.updateObject(token, type, id, update, function(err, result){
                assert.deepEqual(err, error);
                done();
            });
        });
    });

    describe("deleteObject", function() {
        it("Should delete an object of id 1", function(done){
            var type = "domain";
            var id = 1;
            var token = 1;
            var objectsAPI = nock("http://mpulse.soasta.com")
                    .delete("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/" + id)
                    .reply(200, function(){
                        assert.strictEqual(this.req.headers["x-auth-token"], token);
                        return "";
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.deleteObject(token, type, id, function(err, result){
                assert.isNull(result);
                assert.isNull(err);
                done();
            });
        });

        it("Should fail deleting the domain", function(done){
            var type = "domain";
            var id = 1;
            var token = 1;
            var expect = "";
            var error = {code: 400, message: "Failed!"};

            var objectsAPI = nock("http://mpulse.soasta.com")
                    .delete("/concerto/services/rest/RepositoryService/v1/Objects/" + type + "/" + id)
                    .replyWithError(error, function(){
                        assert.strictEqual(this.req.headers["x-auth-token"], token);
                    });

            var Objects = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var objects = new Objects(constants.REPOSITORY_URL);
            objects.deleteObject(token, type, id, function(err, result){
                assert.equal(err, error);
                assert.isUndefined(result);
                done();
            });
        });
    });
});
