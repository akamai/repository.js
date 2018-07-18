/* global describe,it */
var path = require("path"),
    chai = require("chai"),
    nock = require("nock");

var REQUIRE_CLASS = path.join(__dirname, "..", "..", "lib", "model", "TimelineObject.js");
var REQUIRE_CONSTANTS = path.join(__dirname, "..", "..", "lib", "constants.js");

var constants = require(REQUIRE_CONSTANTS);
var TimelineObject = require(REQUIRE_CLASS);

var assert = chai.assert;

describe("TimelineObject Tests", function() {
    it("Should require without problems", function() {
        require(REQUIRE_CLASS);
    });

    it("Should create an instance of SOASTA.Timeline", function() {
        var expect = "/mpulse/api/timeline/v1";
        var TimelineObject = require(REQUIRE_CLASS);
        var timeline = new TimelineObject("");

        assert.instanceOf(timeline, TimelineObject);
        assert.strictEqual(timeline.endpoint, expect);
    });

    describe("createTimelineObject():", function() {
        it("Should create object successfully and return an ID", function(done) {
          
            var properties = {
                appIds:[],
                TimelineItemType: "Insights",
                start: 1531242000000,
                end:1531414800000,
                timelineItem: {
                    timelineItemContent: {
                        title: "",
                        text: "",
                        category: "",
                        content: {
                            beacons: "",
                            threeSecLoadTime: "",
                            fourSecLoadTime: ""
                        }
                    }
                }
            };
            var expect = 1;  
            var objectsAPI = nock("http://localhost:8080")
          .post("/concerto/mpulse/api/timeline/v1")
          .reply(200,  function(uri, requestBodyObject) {
              var requestBody = JSON.parse(requestBodyObject);
              assert.deepEqual(properties, requestBody);
              return { id: expect };
          });

            var objects = new TimelineObject(constants.TIMELINE_URL);
            objects.createTimelineObject(1, properties, function(error, result) {
                assert.isUndefined(error);
                assert.deepEqual(result, expect);
      
                done();
            });
        });

        it("Should try to create object but fail", function(done) {
            var objectsUrlAppend = "";
            var properties = {
                appIds:[],
                TimelineItemType: "Insights",
                start: 1531242000000,
                end:1531414800000,
                timelineItem: {
                    timelineItemContent:{
                        title: "",
                        text: "",
                        category: "eventWeeklySummary",
                        content: {
                            beacons: "",
                            threeSecLoadTime: "",
                            fourSecLoadTime: ""
                        }
                    }
                }
            };
            var expect = { message: "Error", code: 500 };
            var objectsAPI = nock("http://localhost:8080")
                    .post("/concerto/mpulse/api/timeline/v1")
                    .replyWithError(expect, function(uri, requestBody) {
                        var requestBodyObject = JSON.parse(requestBody);
                        assert.deepEqual(properties, requestBodyObject);
                        return expect;
                    });

            var TimelineObject = require(REQUIRE_CLASS);
            var constants = require(REQUIRE_CONSTANTS);

            var timeline = new TimelineObject(constants.TIMELINE_URL);
            timeline.createTimelineObject(1, properties, function(error, result) {
                assert.deepEqual(error, expect);
                done();
            });
        });
    });

    // getObjectByID Tests

    describe("getTimelineObjectByID():", function() {
        it("Should retrieve an TimelineObject successfully and return it as object", function(done) {
            var expect = {
                appIds:[],
                TimelineItemType: "Insights",
                start: 1531242000000,
                end:1531414800000,
                timelineItem: {
                    timelineItemContent: {
                        title: "",
                        text: "",
                        category: "eventWeeklySummary",
                        content: {
                            beacons: "",
                            threeSecLoadTime: "",
                            fourSecLoadTime: ""
                        }
                    }
                }
            };
            var id = 1;
     
            var objectsAPI = nock("http://localhost:8080")
              .get("/concerto/mpulse/api/timeline/v1/" + id)
              .reply(200, function(uri, requestBody) {
                  assert.strictEqual(this.req.headers["x-auth-token"], 1);
                  return expect;
              });

            var objects = new TimelineObject(constants.TIMELINE_URL);
            objects.getTimelineObjectByID(1, 1, function(error, result) {
                assert.isUndefined(error);
                assert.deepEqual(result, expect);

                done();
            });
        });

        it("Should try to get an object by ID but fail", function(done) {
            var id = 1;
            var expect = { message: "Error", code: 500 };
            var objectsAPI = nock("http://localhost:8080")
                .get("/concerto/mpulse/api/timeline/v1/" + id)
                .replyWithError(expect, function(uri, requestBody) {
                    assert.strictEqual(this.req.headers["x-auth-token"], 1);
                });

            var objects = new TimelineObject(constants.TIMELINE_URL);
            objects.getTimelineObjectByID(1, 1, function(error, result) {
                assert.deepEqual(error, expect);
                done();
            });
        });
    });

    describe("getTimelineObjectsList", function() {
        it("Should retrieve a list of TimelineObject matching properties", function(done) {
            var expect = { events: [{
                appIds:[],
                TimelineItemType: "Insights",
                start: 1531242000000,
                end:1531414800000,
                timelineItem: {
                    timelineItemContent:{
                        title: "",
                        text: "",
                        category: "eventWeeklySummary",
                        content: {
                            beacons: "",
                            threeSecLoadTime: "",
                            fourSecLoadTime: ""
                        }
                    }
                }
            }] };
            var query = { start: 1531242000000 };
            var objectsAPI = nock("http://localhost:8080")
                .get("/concerto/mpulse/api/timeline/v1?start=1531242000000")
                .reply(200, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], 1);
                    return expect;
                });

            var timelineobjects = new TimelineObject(constants.TIMELINE_URL);
            timelineobjects.getTimelineObjectsList(1, query, function(error, result) {
                assert.isUndefined(error);
                assert.deepEqual(result, expect);
                done();
            });
        });

        it("Should try to query but fail when returned a failure", function(done) {
            var query = { start: 1531242000000 };
            var error = { code: 500, message: "Failed" };
            var objectsAPI = nock("http://localhost:8080")
              .get("/concerto/mpulse/api/timeline/v1?start=1531242000000")
              .replyWithError(error, function() {
                  assert.strictEqual(this.req.headers["x-auth-token"], 1);
                  return expect;
              });

            var timelineobjects = new TimelineObject(constants.TIMELINE_URL);
            timelineobjects.getTimelineObjectsList(1, query, function(err, result) {
                assert.isUndefined(result);
                assert.deepEqual(error, err);
                done();
            });
        });
    });
    describe("updateTimelineObject", function() {
        it("Should update timeline object with properties at ID", function(done) {
            var id = 1;
            var token = 1;
            var update = { start:1531414800000 };
            var data = {
                appIds:[],
                TimelineItemType: "Insights",
                start: 1531242000000,
                end:1531414800000,
                timelineItem: {
                    timelineItemContent:{
                        title: "",
                        text: "",
                        category: "eventWeeklySummary",
                        content: {
                            beacons: "",
                            threeSecLoadTime: "",
                            fourSecLoadTime: ""
                        }
                    }
                }
            };

            var objectsAPI = nock("http://localhost:8080")
              .put("/concerto/mpulse/api/timeline/v1/" + id)
              .reply(200, function() {
                  assert.strictEqual(this.req.headers["x-auth-token"], token);
                  data.start = update.start;
                  return data;
              });

            var timelineobject = new TimelineObject(constants.TIMELINE_URL);
            timelineobject.updateTimelineObject(token, id, update, function(err, result) {
                assert.deepEqual(update.start, result.start);
                done();
            });
        });

        it("Should fail with an error when updating the timeline object", function(done) {
            var id = 1;
            var token = 1;
            var error = {
                message: "failed",
                code: 400
            };
            var update = { start:  1531414800000 };
            var data = {
                appIds:[],
                TimelineItemType: "Insights",
                start: 1531242000000,
                end:1531414800000,
                timelineItem: {
                    timelineItemContent:{
                        title: "",
                        text: "",
                        category: "eventWeeklySummary",
                        content: {
                            beacons: "",
                            threeSecLoadTime: "",
                            fourSecLoadTime: ""
                        }
                    }
                }
            };
            var objectsAPI = nock("http://localhost:8080")
                .put("/concerto/mpulse/api/timeline/v1/" + id)
                .replyWithError(error, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                });

            var objects = new TimelineObject(constants.TIMELINE_URL);
            objects.updateTimelineObject(token, id, update, function(err, result) {
                assert.deepEqual(err, error);
                done();
            });
        });
    });

    describe("deleteTimelineObject", function() {
        it("Should delete a timeline object of id 1", function(done) {
            var id = 1;
            var token = 1;
            var objectsAPI = nock("http://localhost:8080")
                .delete("/concerto/mpulse/api/timeline/v1/" + id)
                .reply(200, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                    return "";
                });

            var objects = new TimelineObject(constants.TIMELINE_URL);
            objects.deleteTimelineObject(token, id, function(err, result) {
                assert.isNull(result);
                assert.isUndefined(err);
                done();
            });
        });

        it("Should fail deleting the timeline object", function(done) {
            var id = 1;
            var token = 1;
            var expect = "";
            var error = { code: 400, message: "Failed!" };

            var objectsAPI = nock("http://localhost:8080")
                .delete("/concerto/mpulse/api/timeline/v1/" + id)
                .replyWithError(error, function() {
                    assert.strictEqual(this.req.headers["x-auth-token"], token);
                });

            var objects = new TimelineObject(constants.TIMELINE_URL);
            objects.deleteTimelineObject(token, id, function(err, result) {
                assert.equal(err, error);
                assert.isUndefined(result);
                done();
            });
        });
    }); 
});
