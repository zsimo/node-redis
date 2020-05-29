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

module.exports = client;