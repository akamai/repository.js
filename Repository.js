var debug_log = require("./debug_log.js");

var SOASTA = {
	Repository: function Repository(service_url) {

		var Tokens = require("./Tokens.js");
		var Objects = require("./Objects.js");
		var SeedData = require("./SeedData.js");

		var tokens = new Tokens(service_url);
		var objects = new Objects(service_url);
		var seed_data = new SeedData(service_url);

		var self = this;

		this.connect = function(tenant_name, user_name, password, callback) {
			// Wrap the provided callback with an in-between
			// that extracts the token before proceeding.
			var wrapper = function(error, token) {
				debug_log("Got token: " + token + " or error: " + error);
				self.token = token;

				// We don't pass the token on, since the caller shouldn't
				// need it for anything.
				if (callback) {
					callback(error);
				}
			};

			// Call the Tokens API with our wrapper.
			tokens.connect(tenant_name, user_name, password, wrapper);
		};

		this.createObject = function(props, callback) {
			objects.createObject(self.token, props, callback);
		};

		this.getObjectByID = function(type, id, callback) {
			objects.getObjectByID(self.token, type, id, callback);
		};

		this.queryObjects = function(type, query, callback) {
			objects.queryObjects(self.token, type, query, callback);
		};

		this.updateObject = function(type, id, props, callback) {
			objects.updateObject(self.token, type, id, props, callback);
		};

		this.deleteObject = function(type, id, callback) {
			objects.deleteObject(self.token, type, id, callback);
		};

		this.readSeedData = function(id, callback) {
			seed_data.readSeedData(self.token, id, callback);
		};

		this.appendSeedData = function(id, content, callback) {
			seed_data.appendSeedData(self.token, id, content, callback);
		};

		this.truncateSeedData = function(id, callback) {
			seed_data.truncateSeedData(self.token, id, callback);
		};

		this.disconnect = function(callback) {
			tokens.disconnect(self.token, callback);
		};

		this.asPromises = function(Promises) {
			var promisesRepository = new Repository(service_url);

			for (name in promisesRepository) {
				var func = promisesRepository[name];

				if (typeof func === "function" && name !== "asPromises") {
					debug_log("Replacing function " + name + " with promise-ified version.");
					func = Promises.denodeify(func);
					promisesRepository[name] = func;
				}
			}

			return promisesRepository;
		};
	}
}

module.exports = SOASTA;
