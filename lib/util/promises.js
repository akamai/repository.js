/**
 * Helper function taken from denodeify. Allows wrapping all our methods in Promises for Async JS Usage
 * 
 * @param {function} with the form of the last argument (if any) being a callback
 * 
 * @returns {function} Promisified function definition for mPulse 
 */
function denodeify(nodeStyleFunction) {
	return function() {
		var that = this;
		var functionArguments = new Array(arguments.length + 1);

		for (var i = 0; i < arguments.length; i += 1) {
			functionArguments[i] = arguments[i];
		}

		function promiseHandler(resolve, reject) {
			function callbackFunction() {
				var args = new Array(arguments.length);

				for (var i = 0; i < args.length; i += 1) {
					args[i] = arguments[i];
				}

				var error = args[0];
				var result = args[1];

				if (error) {
					return reject(error);
				}

				return resolve(result);
			}

			functionArguments[functionArguments.length - 1] = callbackFunction;
			nodeStyleFunction.apply(that, functionArguments);
		}

		return new Promise(promiseHandler);
	};
}

module.exports.denodeify = denodeify;
