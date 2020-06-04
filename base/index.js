"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
const GET = promisify(client.GET).bind(client);
const SET = promisify(client.SET).bind(client);


async function run () {
    const reply = await SET("hello", "hello");
    console.log(reply);
    const value = await GET("hello");
    console.log(value);

    client.quit();
}



try {
    run();
} catch (e) {
    console.error(e);
}