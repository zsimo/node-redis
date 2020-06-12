var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var luaFile = path.resolve(process.cwd(), "lua", "test.lua");
var fs = require("fs");
const { promisify } = require("util");
const SCRIPT = promisify(client.SCRIPT).bind(client);
const EVALSHA = promisify(client.EVALSHA).bind(client);

var sha;

const load = async () => {

    // // Load script on first use...
    if (!sha) {
        sha = await SCRIPT('load', fs.readFileSync(luaFile, {
            encoding: "utf8"
        }));
    }
    return sha;
};


async function run () {
    sha = await load();
    var result = await EVALSHA(sha, 1, "ciao", 1);
    console.log(result);

    client.quit();
}



try {
    run();
} catch (e) {
    console.error(e);
}