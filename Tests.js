var SOASTA = require("./Repository.js");
var Q = require("Q");

var tenantName = null;
var userName = "admin";
var password = "";

var repo = new SOASTA.Repository("http://localhost:8080/concerto/services/rest/RepositoryService/v1");

var connect = Q.denodeify(repo.connect);

connect(tenantName, userName, password).then(function() {
	console.log("Got connect callback!");
}, function(error) {
	console.log("Connect failed! " + error.message);
});

/*
repo.createObject({
	name: "some name!",
	type: "some type!"
}, function() {
	console.log("Got createObject callback!");
});

repo.getObjectByID("composition", 42, function() {
	console.log("Got getObjectByID callback!");
});

repo.queryObjects("composition", {
	"last_played": "whenever!"
}, function() {
	console.log("Got queryObjects callback!");
});

repo.updateObject("messageclip", 21, {
	"something!": "whatever!"
}, function() {
	console.log("Got updateObject callback!");
});

repo.deleteObject("target", 84, function() {
	console.log("Got deleteObject callback!");
});

repo.readSeedData(121, function() {
	console.log("Got readSeedData callback!");
});

repo.appendSeedData(363, "new CSV!", function() {
	console.log("Got appendSeedData callback!");
});

repo.truncateSeedData(242, function() {
	console.log("Got truncateSeedData callback!");
});

repo.disconnect(function() {
	console.log("Got disconnect callback!");
});

}
});
*/
