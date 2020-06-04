"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
const HMSET = promisify(client.HMSET).bind(client);
const HGETALL = promisify(client.HGETALL).bind(client);

var hashName = "myhash";
var hash = {
    uno: 1,
    due: 2
};

async function run () {
    console.log(hash);
    const reply = await HMSET(hashName, hash);
    console.log(reply);
    const value = await HGETALL(hashName);
    console.log(value);
    console.log("redis hashes contain only string");
    client.quit();
}



try {
    run();
} catch (e) {
    console.error(e);
}