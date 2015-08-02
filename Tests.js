var SOASTA = require("./Repository.js");
var Q = require("Q");

var tenantName = null;
var userName = "admin";
var password = "";

var repo = new SOASTA.Repository("http://localhost:8080/concerto/services/rest/RepositoryService/v1");

var connect = Q.denodeify(repo.connect);
var disconnect = Q.denodeify(repo.disconnect);
var createObject = Q.denodeify(repo.createObject);
var getObjectByID = Q.denodeify(repo.getObjectByID);
var queryObjects = Q.denodeify(repo.queryObjects);
var updateObject = Q.denodeify(repo.updateObject);

connect(tenantName, userName, password).then(function() {
	console.log("Got connect callback!");

	return createObject({
		name: "some name!",
		type: "some type!"
	});
}, function(error) {
	console.log("Connect failed! " + error.message);
}).then(function() {
	console.log("Got createObject callback!");
	return getObjectByID("composition", 42);
}).then(function() {
	console.log("Got getObjectByID callback!");
	return queryObjects("composition", {
		"last_played": "whenever!"
	});
}).then(function() {
	console.log("Got queryObjects callback!");
	return updateObject("messageclip", 21, {
		"something!": "whatever!"
	});
}).then(function() {
	console.log("Got updateObject callback!");
	return disconnect();
}).then(function() {
	console.log("Got disconnect callback!");
});

/*
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
