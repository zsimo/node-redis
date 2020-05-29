"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));
var count = 0;


setInterval(function () {

    client.LPUSH(config.queue_name, count, function (err, reply) {
        console.log(err, reply);
    });


    client.LLEN(config.queue_name, function (err, reply) {
        console.log(err, "queue length: " + reply);

        // client.LRANGE(config.queue_name, 0, reply, function (err, reply) {
        //     console.log(err, "queue content: " + JSON.stringify(reply));
        // });
    });


    count ++;


}, 1000);
