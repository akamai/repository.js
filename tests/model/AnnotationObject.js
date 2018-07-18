/* global describe,it */
var path = require("path"),
    chai = require("chai"),
    nock = require("nock");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "model", "AnnotationObject.js");
var REQUIRE_CONSTANTS = path.join(__dirname, "..", "..", "lib", "constants.js");

var constants = require(REQUIRE_CONSTANTS);
var AnnotationObject = require(REQUIRE_CLASS);

var assert = chai.assert;

describe("AnnotationObject Tests", function() {
    it("Should require without problems", function() {
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of SOASTA.Annotation", function() {
        var expect = "/mpulse/api/annotations/v1";
        var AnnotationObject = require(REQUIRE_CLASS);
        var annotation = new AnnotationObject("");

        assert.instanceOf(annotation, AnnotationObject);
        assert.strictEqual(annotation.endpoint, expect);
    });

    describe("createAnnotationObject():", function() {
        it("Should create annotation object successfully and return an ID", function(done) {
          
            var properties = {
                title:"update",
                start:1530117827013, 
                text:"Starting update domains", 
                domainIds:[]
            };
            var expect = 1;  
            var objectsAPI = nock("http://localhost:8080")
          .post("/concerto/mpulse/api/annotations/v1")
          .reply(200,  function(uri, requestBodyObject) {
              var requestBody = JSON.parse(requestBodyObject);
              assert.deepEqual(properties, requestBody);
              return { id: expect };
          });

            var objects = new AnnotationObject(constants.ANNOTATION_URL);
            objects.createAnnotationObject(1, properties, function(error, result) {
                assert.isUndefined(error);
                assert.deepEqual(result, expect);
      
                done();
            });
        });

        it("Should try to create object but fail", function(done) {
            var objectsUrlAppend = "";
            var properties = {
                title:"update",
                start:1530117827013, 
                text:"Starting update domains", 
                domainIds:[]
            };
            var expect = { message: "Error", code: 500 };
            var objectsAPI = nock("http://localhost:8080")
                    .post("/concerto/mpulse/api/annotations/v1")
                    .replyWithError(expect, function(uri, requestBody) {
                        var requestBodyObject = JSON.parse(requestBody);
                        assert.deepEqual(properties, requestBodyObject);
                        return expect;
                    });

            var AnnotationObject = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var annotation = new AnnotationObject(constants.ANNOTATION_URL);
            annotation.createAnnotationObject(1, properties, function(error, result) {
                assert.deepEqual(error, expect);
                done();
            });
        });
    });

    // getObjectByID Tests

    describe("getAnnotationObjectByID():", function() {
        it("Should retrieve an AnnotationObject successfully and return it as object", function(done) {
            var expect = {
                title:"update",
                start:1530117827013, 
                text:"Starting update domains", 
                domainIds:[]
            };
            var id = 1;
     
            var objectsAPI = nock("http://localhost:8080")
              .get("/concerto/mpulse/api/annotations/v1/" + id)
              .reply(200, function(uri, requestBody) {
                  assert.strictEqual(this.req.headers["x-auth-token"], 1);
                  return expect;
              });

            var objects = new AnnotationObject(constants.ANNOTATION_URL);
            objects.getAnnotationObjectByID(1, 1, function(error, result) {
                assert.isUndefined(error);
                assert.deepEqual(result, expect);

                done();
            });
        });

        it("Should try to get an object by ID but fail", function(done) {
            var id = 1;
            var expect = { message: "Error", code: 500 };
            var objectsAPI = nock("http://localhost:8080")
                .get("/concerto/mpulse/api/annotations/v1/" + id)
                .replyWithError(expect, function(uri, requestBody) {
                    assert.strictEqual(this.req.headers["x-auth-token"], 1);
                });

            var objects = new AnnotationObject(constants.ANNOTATION_URL);
            objects.getAnnotationObjectByID(1, 1, function(error, result) {
                assert.deepEqual(error, expect);
                done();
            });
        });
    });

    describe("getAnnotationObjectsList", function() {
        it("Should retrieve a list of AnnotationObject matching properties", function(done) {
            var expect = { events: [{
                domainIds:[],
                title:"update",
                start:1530117827013, 
                text:"Starting update domains"
            }] };
            var query = { start: 1531242000000 };
            var objectsAPI = nock("http://localhost:8080")
                .get("/concerto/mpulse/api/annotations/v1?start=1531242000000")
                .reply(200, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], 1);
                    return expect;
                });

            var AnnotationObjects = new AnnotationObject(constants.ANNOTATION_URL);
            AnnotationObjects.getAnnotationObjectsList(1, query, function(error, result) {
                assert.isUndefined(error);
                assert.deepEqual(result, expect);
                done();
            });
        });

        it("Should try to query but fail when returned a failure", function(done) {
            var query = { start: 1531242000000 };
            var error = { code: 500, message: "Failed" };
            var objectsAPI = nock("http://localhost:8080")
              .get("/concerto/mpulse/api/annotations/v1?start=1531242000000")
              .replyWithError(error, function() {
                  assert.strictEqual(this.req.headers["x-auth-token"], 1);
                  return expect;
              });

            var annotationObjects = new AnnotationObject(constants.ANNOTATION_URL);
            annotationObjects.getAnnotationObjectsList(1, query, function(err, result) {
                assert.isUndefined(result);
                assert.deepEqual(error, err);
                done();
            });
        });
    });
    describe("updateAnnotation", function() {
        it("Should update annotation object with properties at ID", function(done) {
            var id = 1;
            var token = 1;
            var update = { start:1531414800000 };
            var data = {
                title:"update",
                start:1530117827013, 
                text:"Starting update domains", 
                domainIds:[]
            };

            var objectsAPI = nock("http://localhost:8080")
              .put("/concerto/mpulse/api/annotations/v1/" + id)
              .reply(200, function() {
                  assert.strictEqual(this.req.headers["x-auth-token"], token);
                  data.start = update.start;
                  return data;
              });

            var annotationObject = new AnnotationObject(constants.ANNOTATION_URL);
            annotationObject.updateAnnotation(token, id, update, function(err, result) {
                assert.deepEqual(update.start, result.start);
                done();
            });
        });

        it("Should fail with an error when updating the annotation object", function(done) {
            var id = 1;
            var token = 1;
            var error = {
                message: "failed",
                code: 400
            };
            var update = { start:  1531414800000 };
            var data = {
                title:"update",
                start:1530117827013, 
                text:"Starting update domains", 
                domainIds:[]
            };
            var objectsAPI = nock("http://localhost:8080")
                .put("/concerto/mpulse/api/annotations/v1/" + id)
                .replyWithError(error, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                });

            var objects = new AnnotationObject(constants.ANNOTATION_URL);
            objects.updateAnnotation(token, id, update, function(err, result) {
                assert.deepEqual(err, error);
                done();
            });
        });
    });

    describe("deleteAnnotationObject", function() {
        it("Should delete a annotation object of id 1", function(done) {
            var id = 1;
            var token = 1;
            var objectsAPI = nock("http://localhost:8080")
                .delete("/concerto/mpulse/api/annotations/v1/" + id)
                .reply(200, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                    return "";
                });

            var objects = new AnnotationObject(constants.ANNOTATION_URL);
            objects.deleteAnnotationObject(token, id, function(err, result) {
                assert.isNull(result);
                assert.isUndefined(err);
                done();
            });
        });

        it("Should fail deleting the annotation object", function(done) {
            var id = 1;
            var token = 1;
            var expect = "";
            var error = { code: 400, message: "Failed!" };

            var objectsAPI = nock("http://localhost:8080")
                .delete("/concerto/mpulse/api/annotations/v1/" + id)
                .replyWithError(error, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                });

            var objects = new AnnotationObject(constants.ANNOTATION_URL);
            objects.deleteAnnotationObject(token, id, function(err, result) {
                assert.equal(err, error);
                assert.isUndefined(result);
                done();
            });
        });
    }); 
});
