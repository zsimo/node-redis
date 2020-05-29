"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));
var count = 0;


var count = 0;

setInterval(function () {
    // * means autogenerate the id
    // then key, values pair
    client.XADD(config.stream_name, "*", "count", count, function (err, reply) {
        console.log(err, reply);
    });


    client.XLEN(config.stream_name, function (err, reply) {
        console.log(err, reply);
    });

    count ++
}, 1000);


/** 
client.XTRIM(config.stream_name, "MAXLEN", 10, function (err, reply) {
    console.log(err, "XTRIM");
});
*/

client.XPENDING(config.stream_name, config.group_name, function (err, reply) {
    console.log(err, reply);
});
