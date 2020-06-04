"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
const RPUSH = promisify(client.RPUSH).bind(client);
const LRANGE = promisify(client.LRANGE).bind(client);

var name = "mylist";

async function run () {
    const reply = await RPUSH(name, [1, 2]);
    console.log(reply);
    const value = await LRANGE(name, 0, -1);
    console.log(value);

    client.quit();
}



try {
    run();
} catch (e) {
    console.error(e);
}