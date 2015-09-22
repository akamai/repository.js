By extending `SOASTA.cmd` you can extend the CLI application and support new command line options and sub-commands.

Here is an example:

```js
var cmd = require("soasta-repository").cmd;

cmd.option("-e, --example <example>", "Foo Option");

cmd.parse(process.argv);
```

Now a new option named `example` is passed into the cli and can be used by the sub-commands via their arguments you may define or create.

You will see the new option being available when calling `./cmd.js --help`.

See [the commander documentation](https://www.npmjs.com/package/commander) for more information.

#### Adding new Subcommands

Now that you have setup your new instance of a CLI application you can add a new module extending the available subcommands.

Say you have the following as your setup for a new subcommand (`domains.js`) to list the names of available domains with
name and IDs in the console:

```js
var CLI = require("soasta-repository").CLI;
var fs = require("fs");

module.exports = function(options) {
    CLI.init(options);

    CLI.connectToRepository(options, function(err, repository) {
        CLI.handleError(err);

        repository.queryObjects("domain", {}, function(err, result) {
            result.objects.forEach(function(object) {
			    console.log(object.id, object.name);
            });
        });
    });
};
```

You can use this in your extended version of the CLI application like this:

```js
var cmd = require("soasta-repository").cmd;

cmd.option("-e, --example <example>", "Foo Option");
cmd.command("domains").description("List domaisn").action(require("domains.js"));
cmd.parse(process.argv);
```

Now you can use it in the terminal:

```shell
$> ./cmd.js domains
"mydomain.com" 2
$>
```
