# repository.js
JavaScript (Node.js) wrapper for the [SOASTA Repository REST API](http://cdn.soasta.com/productresource/api/repository_api/index.html).  Provides support for:

* Creating, reading, updating and deleting Repository objects.
* Reading, writing, and deleting seed data.
* Now with support for a web context!

All methods follow the Node.js convention of accepting a callback with the signature `function(error, response)`.  A promise-based API is also available (see below).

# Usage
Create a new `Repository` object and pass in the endpoint URL, then call `connect` with the appropriate credentials.

Example:
```JavaScript
var SOASTA = require("soasta-repository").SOASTA;
var repo = new SOASTA.Repository("https://mpulse.soasta.com/concerto/services/rest/RepositoryService/v1");

// The first parameter is an optional tenant name.  If you're working in a multi-tenant environment,
// and your account has the Tenant Administrator privilege, then you can use this to control which tenant
// your session uses.  Otherwise, leave it set to null.
repo.connect(null, "my user name", "secret", function(error) {
  if (error) {
    // Connection failed.
    // Can be caused by invalid credentials or network problems.
  } else {
    // We're good to go!
    repo.queryObjects("seeddata", {
      "name": "Example seed data object"
    }, function(error, objectSet) {
      // Extract the ID from the search results.
      var id = objectSet.objects[0].id;

      // Add some new data.
      repo.appendSeedData(id, "value1,value2,value3\nvalue4,value5,value6\nvalue7,value8,value9", function(error) {
        // Load it back!
        repo.readSeedData(id, function(error, content) {
          console.log("Seed data now looks like this: " + content);

          // Clear it out, to reset for next time.
          repo.truncateSeedData(id);
        });
      });
    });
  }
});
```
The Repository class provides the following methods for reading and writing objects:

* `createObject(props)` - create a new Repository object.
* `getObjectByID(type, id)` - return the Repository object with the specified type and ID.
* `queryObjects(type, params)` - query the list of objects with the specified type.
* `updateObject(type, id, props)` - update the Repository object with the specified type and ID.
* `deleteObject(type, id)` - delete the Repository object with the specified type and ID.

The Repository class provides the following methods for reading and writing seed data:

* `readSeedData` - returns seed data content in CSV form.
* `appendSeedData` - appends new CSV to an existing seed data object.
* `truncateSeedData` - deletes all content from an existing seed data object.

Create a new `Annotation` object and pass in the endpoint URL, then call `connect` with the appropriate credentials.

Example:
```JavaScript
var SOASTA = require("soasta-repository").SOASTA;
var repo = new SOASTA.Repository(options.parent.repository);
var annotation = new SOASTA.Annotation(options.parent.repository);

// The first parameter is an optional tenant name.  If you're working in a multi-tenant environment,
// and your account has the Tenant Administrator privilege, then you can use this to control which tenant
// your session uses.  Otherwise, leave it set to null.
repo.connect(null, "my user name", "secret", function(error) {
  if (error) {
    // Connection failed.
    // Can be caused by invalid credentials or network problems.
  } else {
    // We're good to go!
    annotation.getAnnotationObjectsList({
      "date-start": "1515052740000"
    }, function(error, data) {
        log.info(data);
    });
  }
});
```

The Annotation class provides the following methods for reading and writing objects:

* `createAnnotationObject(props)` - create a new Annotation object.
* `getAnnotationObjectByID(id)` - return the Annotation object with the ID.
* `getAnnotationObjectsList(params)` - get the list of annotations with the specified params.
* `updateAnnotation(id, props)` - update the Annotation object with the specified ID.
* `deleteAnnotationObject(id)` - delete the Annotation object with the specified ID.

Create a new `Timeline` object and pass in the endpoint URL, then call `connect` with the appropriate credentials.

Example:
```JavaScript
var SOASTA = require("soasta-repository").SOASTA;
var repo = new SOASTA.Repository(options.parent.repository);
var timeline = new SOASTA.Timeline(options.parent.repository);

// The first parameter is an optional tenant name.  If you're working in a multi-tenant environment,
// and your account has the Tenant Administrator privilege, then you can use this to control which tenant
// your session uses.  Otherwise, leave it set to null.
repo.connect(null, "my user name", "secret", function(error) {
  if (error) {
    // Connection failed.
    // Can be caused by invalid credentials or network problems.
  } else {
    // We're good to go!
    timeline.getTimelineObjectsList({
      "date-start": "1515052740000"
    }, function(error, data) {
        log.info(data);
    });
  }
});
```
The Timeline class provides the following methods for reading and writing objects:

* `createTimelineObject(props)` - create a new Timeline object.
* `getTimelineObjectByID(id)` - return the Timeline object with the ID.
* `getTimelineObjectsList(params)` - get the list of Timeline objects with the specified params.
* `deleteTimelineObject(id)` - delete the Timeline object with the specified ID.

# Promise support
To learn more about JavaScript promises, see [this article](http://www.html5rocks.com/en/tutorials/es6/promises/), among others.  The Repository API is **not** promise-based by default, but provides an `asPromises` helper method that you can call to obtain a "promise-enabled" version.

The `asPromises` method takes a "bring-your-own-library" approach.  Rather than explicitly using [Q](https://github.com/kriskowal/q) or another implementation, it accepts any object that provides a `denodeify()` function.  Most of the popular Promises implementations include this.

## Promise example

Here's the same example as above, using the promise-based version.

```JavaScript
var SOASTA = require("soasta-repository").SOASTA;

var repo = new SOASTA.Repository("https://mpulse.soasta.com/concerto/services/rest/RepositoryService/v1");
repo = repo.asPromises();

repo.connect(null, "my user name", "secret")
.then(function() {
  // Connected successfully!
  // Query the Repository to get the ID of our example seed data object.
  return repo.queryObjects("seeddata", {
    "name": "Example seed data object"
  });
})
.then(function(objectSet) {
  // Extract the ID from the search results.
  var id = objectSet.objects[0].id;

  // Use nested promises from here on out, since we need to keep the ID in scope.

  // Add some new data.
  repo.appendSeedData(id, "value1,value2,value3\nvalue4,value5,value6\nvalue7,value8,value9")
  .then(function() {
    // Load it back!
    return repo.readSeedData(id);
  })
  .then(function(content) {
    console.log("Seed data now looks like this: " + content);

    // Clear it out, to reset for next time.
    return repo.truncateSeedData(id);
  });
});
```

# Command-line Interace (CLI)

A command-line wrapper is available via `cmd.js`:

    node cmd.js    

The list of commands and other help is available via the `--help` command:

    node cmd.js --help

For example, to query all domains:

    node cmd.js --username [user] --password [password] query domain

You can put defaults for username, password, repository and tenant in an `auth.json` file:

```
{
    "username": "",
    "password": "",
    "repository": "",
    "tenant": ""
}
```
# Command-line Interace for Annotations (CLI)

A command-line wrapper is available via `cmdAnnotation.js`:

    node cmdAnnotation.js    

The list of commands and other help is available via the `--help` command:

    node cmdAnnotation.js --help

For example, to query all annotations from spesipic date:

    node cmdAnnotation.js --username [user] --password [password] query date-start=1515052740000

You can put defaults for username, password, repository and tenant in an `auth.json` file:

```
{
    "username": "",
    "password": "",
    "repository": "",
    "tenant": ""
}
```
# Command-line Interace for Timeline (CLI)

A command-line wrapper is available via `cmdTimeline.js`:

    node cmdTimeline.js    

The list of commands and other help is available via the `--help` command:

    node cmdTimeline.js --help

For example, to query all annotations from spesipic date:

    node cmdTimeline.js --username [user] --password [password] query date-start=1515052740000

You can put defaults for username, password, repository and tenant in an `auth.json` file:

```
{
    "username": "",
    "password": "",
    "repository": "",
    "tenant": ""
}
```
