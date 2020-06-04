"use strict";

var path = require("path");
var config = require(path.resolve(process.cwd(), "config"));

var retryStrategy = require("node-redis-retry-strategy")();
var redis = require("redis");

var redisOptions = {
    retry_strategy: retryStrategy,
    port: config.REDIS_PORT
};

var client = redis.createClient(redisOptions);

client.on("ready", function () {
    console.log("redis client ready");
});
client.on("end", function () {
    console.log("redis connection has closed");
});
client.on("reconnecting", function (o) {
    console.log("redis client reconnecting", o.attempt, o.delay);
});

module.exports = client;