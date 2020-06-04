"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
const SADD = promisify(client.SADD).bind(client);
const SCARD = promisify(client.SCARD).bind(client);
const SMEMBERS = promisify(client.SMEMBERS).bind(client);


// sets do not allow duplication
var name = "myset";

async function run () {
    var reply = await SADD(name, [1, 2]);
    console.log(reply);
    reply = await SADD(name, 3);
    console.log(reply);
    var value = await SCARD(name);
    console.log(value);
    value = await SMEMBERS(name);
    console.log(value);

    client.quit();
}



try {
    run();
} catch (e) {
    console.error(e);
}