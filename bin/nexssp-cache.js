#!/usr/bin/env node
const { bold } = require("@nexssp/ansi");

(async () => {
  const cliArgs = require("minimist")(process.argv.slice(2));

  if (cliArgs._[0] === "help") {
    const pkg = require("../package.json");

    console.log(`   ${bold(pkg.name)}@${pkg.version}`);
    console.log(`nexssp-cache clear`);
    process.exit(0);
  }
  console.time(bold("@nexssp/cache"));
  console.log("Not implemented yet.");
  console.log(`Found at: ${bold(path)}`);
  console.timeEnd(bold("@nexssp/cache"));
})();
