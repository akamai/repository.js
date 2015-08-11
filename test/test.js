var SOASTA = require("../lib/model/Repository.js");
var Q = require("Q");
var Stream = require("stream");

var tenantName = null;
var userName = "SOASTA";
var password = "password";

var seedDataID = 1;

var repo = new SOASTA.Repository("http://localhost:8080/concerto/services/rest/RepositoryService/v1");
repo = repo.asPromises(Q);

repo.connect(tenantName, userName, password).then(function() {
	console.log("Got connect callback!");

	repo.createObject({
		type: "preference",
		name: "some pref!"
	}).then(function(id) {
		console.log("Got createObject callback! id=" + id);

		repo.getObjectByID("preference", id).then(function(object) {
			console.log("Got getObjectByID callback! object=" + object);
			return repo.queryObjects("preference", {
				"name": "some pref!"
			});
		}).then(function(objectSet) {
			console.log("Got queryObjects callback! objectSet=" + objectSet);
			return repo.updateObject("preference", id, {
				"description": "whatever!"
			});
		}).then(function() {
			console.log("Got updateObject callback!");
			return repo.deleteObject("preference", id);
		}).then(function() {
			console.log("Get deleteObject callback!");
			var csvReader = new Stream.Readable();
			csvReader.push("new CSV!");
			csvReader.push(null);
			return repo.appendSeedDataStream(seedDataID, csvReader);
		}).then(function() {
			console.log("Get appendSeedData callback!");
			return repo.readSeedDataStream(seedDataID, process.stdout);
		}).then(function() {
			console.log("Get seedSeedDataStream callback!");
			return repo.readSeedData(seedDataID);
		}).then(function(content) {
			console.log("Get readSeedData callback! content=" + content);
			return repo.truncateSeedData(seedDataID);
		}).then(function() {
			console.log("Get truncateSeedData callback!");
		}).done();
	}).catch(function(error) {
		console.log("ERROR! " + error.message);

	// No matter what I do, I can't seem to make this execute only *after* the above finishes.
	// It always happens in the middle of the above promise chain.  Something I'm not understanding
	// about how Q or Node works, or maybe a bug in one of the libraries.
	/*
	}).then(function() {
		return repo.disconnect();
	}).then(function() {
		console.log("Got disconnect callback!");
	*/

	}).done();
}, function(error) {
	console.log("Connect failed! " + error.message);
});
