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

		this.create_object = function(props, callback) {
			objects.create_object(tokens.token, props, callback);
		};

		this.get_object_by_id = function(type, id, callback) {
			objects.get_object_by_id(tokens.token, type, id, callback);
		};

		this.query_objects = function(type, query, callback) {
			objects.query_objects(tokens.token, type, query, callback);
		};

		this.update_object = function(type, id, props, callback) {
			objects.update_object(tokens.token, type, id, props, callback);
		};

		this.delete_object = function(type, id, callback) {
			objects.delete_object(tokens.token, type, id, callback);
		};

		this.read_seed_data = function(id, callback) {
			seed_data.read_seed_data(tokens.token, id, callback);
		};

		this.append_seed_data = function(id, content, callback) {
			seed_data.append_seed_data(tokens.token, id, content, callback);
		};

		this.truncate_seed_data = function(id, callback) {
			seed_data.truncate_seed_data(tokens.token, id, callback);
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

repo.create_object({
	name: "some name!",
	type: "some type!"
}, function() {
	console.log("Got create_object callback!");
});

repo.get_object_by_id("composition", 42, function() {
	console.log("Got get_object_by_id callback!");
});

repo.query_objects("composition", {
	"last_played": "whenever!"
}, function() {
	console.log("Got query_objects callback!");
});

repo.update_object("messageclip", 21, {
	"something!": "whatever!"
}, function() {
	console.log("Got update_object callback!");
});

repo.delete_object("target", 84, function() {
	console.log("Got delete_object callback!");
});

repo.read_seed_data(121, function() {
	console.log("Got read_seed_data callback!");
});

repo.append_seed_data(363, "new CSV!", function() {
	console.log("Got append_seed_data callback!");
});

repo.truncate_seed_data(242, function() {
	console.log("Got truncate_seed_data callback!");
});

repo.disconnect(function() {
	console.log("Got disconnect callback!");
});

