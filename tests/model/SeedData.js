/* global describe,it*/
var path = require("path"),
    fs = require("fs"),
    stream = require("stream"),
    chai = require("chai"),
    nock = require("nock");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "model", "SeedData.js");
var REQUIRE_CONSTANTS = path.join(__dirname, "..", "..", "lib", "constants.js");
var SUPPORT_FILE = path.join(__dirname, "..", "support", "seed-data.csv");

var assert = chai.assert;

var SeedData = require(REQUIRE_CLASS);
var constants = require(REQUIRE_CONSTANTS);

describe("SeedData Tests", function() {

    it("Should require without problems", function() {
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of SOASTA.Repository", function() {
        var expect = "http://mpulse.soasta.com/concerto/services/rest/RepositoryService/v1/SeedData";
        var seedData = new SeedData(constants.REPOSITORY_URL);

        assert.instanceOf(seedData, SeedData);
        assert.strictEqual(seedData.endpoint, expect);
    });

    describe("readSeedData", function() {
        it("Should call readSeedData and succeed", function(done) {
            var seedDataCSV = "\"value1\",\"value2\",\"value3\",\"value4\"," +
                "\"value5\",\"value6\",\"value7\",\"value7\"\n";
            var token = 1;
            var objectsUrlAppend = "/SeedData";
            var id = 1;

            var seedDataAPI = nock("http://mpulse.soasta.com")
                .get("/concerto/services/rest/RepositoryService/v1/SeedData/" + id)
                .reply(200,  function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                    return seedDataCSV;
                });

            var seedData = new SeedData(constants.REPOSITORY_URL);
            seedData.readSeedData(token, id, function(err, result) {
                assert.strictEqual(result, seedDataCSV);
                done();
            });
        });

        it("Should call readSeedData and fail", function(done) {
            var token = 1;
            var objectsUrlAppend = "/SeedData";
            var id = 1;
            var error = { code: 400, message: "failed" };
            var seedDataAPI = nock("http://mpulse.soasta.com")
                .get("/concerto/services/rest/RepositoryService/v1/SeedData/" + id)
                .replyWithError(error);

            var seedData = new SeedData(constants.REPOSITORY_URL);
            seedData.readSeedData(token, id, function(err, result) {
                assert.isUndefined(result);
                assert.deepEqual(err, error);
                done();
            });
        });
    });

    describe("readSeedDataStream", function() {
        it("Should call readSeedDataStream and succeed", function(done) {
            var token = 1;
            var objectsUrlAppend = "/SeedData";
            var id = 1;
            var seedDataAPI = nock("http://mpulse.soasta.com")
                .get("/concerto/services/rest/RepositoryService/v1/SeedData/" + id)
                .reply(200, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                    return fs.createReadStream(SUPPORT_FILE);
                });

            var outStream = new stream.Writable();
            outStream._write = function(data, encoding, next) {
                assert.isDefined(data);
            };

            var seedData = new SeedData(constants.REPOSITORY_URL);
            seedData.readSeedDataStream(token, id, outStream, function(err, result) {
                done();
            });
        });
    });

});
