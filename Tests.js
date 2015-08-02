var SOASTA = require("./Repository.js");
var Q = require("Q");

var tenantName = null;
var userName = "admin";
var password = "";

var repo = new SOASTA.Repository("http://localhost:8080/concerto/services/rest/RepositoryService/v1");
repo = repo.asPromises(Q);

repo.connect(tenantName, userName, password).then(function() {
	console.log("Got connect callback!");

	repo.createObject({
		name: "some name!",
		type: "some type!"
	}).then(function() {
		console.log("Got createObject callback!");
		return repo.getObjectByID("composition", 42);
	}).then(function() {
		console.log("Got getObjectByID callback!");
		return repo.queryObjects("composition", {
			"last_played": "whenever!"
		});
	}).then(function() {
		console.log("Got queryObjects callback!");
		return repo.updateObject("messageclip", 21, {
			"something!": "whatever!"
		});
	}).then(function() {
		console.log("Got updateObject callback!");
		return repo.deleteObject("target", 84);
	}).then(function() {
		console.log("Get deleteObject callback!");
		return repo.readSeedData(121);
	}).then(function() {
		console.log("Get readSeedData callback!");
		return repo.appendSeedData(363, "new CSV!");
	}).then(function() {
		console.log("Get appendSeedData callback!");
		return repo.truncateSeedData(242);
	}).then(function() {
		console.log("Get truncateSeedData callback!");
		return repo.disconnect();
	}).then(function() {
		console.log("Got disconnect callback!");
	});
}, function(error) {
	console.log("Connect failed! " + error.message);
});
