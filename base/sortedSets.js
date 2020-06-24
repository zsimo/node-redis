"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
const ZADD = promisify(client.ZADD).bind(client);
const ZCOUNT = promisify(client.ZCOUNT).bind(client);
const ZRANGE = promisify(client.ZRANGE).bind(client);

// sets do not allow duplication
var name = "metrics2";

async function run () {
    var reply = await ZADD(name, 0, '25.0');
    console.log(reply);
    reply = await ZADD(name, 1, '26.1');
    console.log(reply);
    reply = await ZADD(name, 2, '22.1');
    console.log(reply);
    reply = await ZADD(name, 3, '22.1');
    console.log(reply);
    reply = await ZCOUNT(name, 0, 100);
    console.log(reply);
    // from lowest to hightest
    reply = await ZRANGE(name, 0, -1, "WITHSCORES");
    console.log(reply);

    client.quit();
}



try {
    run();
} catch (e) {
    console.error(e);
}