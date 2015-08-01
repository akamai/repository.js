var SOASTA = {
	Repository: function Repository(service_url) {

		var Tokens = require("./Tokens.js");
		var Objects = require("./Objects.js");
		var SeedData = require("./SeedData.js");

		var tokens = new Tokens(service_url);
		var objects = new Objects(service_url);
		var seed_data = new SeedData(service_url);

		this.connect = function(tenant_name, user_name, password, callback) {
			tokens.connect(tenant_name, user_name, password, callback);
		};

		this.createObject = function(props, callback) {
			objects.createObject(tokens.token, props, callback);
		};

		this.getObjectByID = function(type, id, callback) {
			objects.getObjectByID(tokens.token, type, id, callback);
		};

		this.queryObjects = function(type, query, callback) {
			objects.queryObjects(tokens.token, type, query, callback);
		};

		this.updateObject = function(type, id, props, callback) {
			objects.updateObject(tokens.token, type, id, props, callback);
		};

		this.deleteObject = function(type, id, callback) {
			objects.deleteObject(tokens.token, type, id, callback);
		};

		this.readSeedData = function(id, callback) {
			seed_data.readSeedData(tokens.token, id, callback);
		};

		this.appendSeedData = function(id, content, callback) {
			seed_data.appendSeedData(tokens.token, id, content, callback);
		};

		this.truncateSeedData = function(id, callback) {
			seed_data.truncateSeedData(tokens.token, id, callback);
		};

		this.disconnect = function(callback) {
			tokens.disconnect(callback);
		};
	}
}

module.exports = SOASTA;

var repo = new SOASTA.Repository("http://localhost:8080/concerto/services/rest/RepositoryService/v1");
repo.connect("myTenant", "myUser", "myPassword", function() {
	console.log("Got connect callback!");
});

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

