"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));
var count = 0;


setInterval(function () {
    
    client.XLEN(config.stream_name, function (err, reply) {
        console.log("total", reply);
    });

    // * means autogenerate the id
    // then key, values pair
    client.XADD(config.stream_name, "*", "count", count, function (err, reply) {
        console.log("new added id", reply, "value", count);
    });

    count ++
}, 1000);


client.XGROUP("CREATE", config.stream_name, config.group_name, 0, function (err, reply) {
    console.log(err, reply);
});

/** 
client.XTRIM(config.stream_name, "MAXLEN", 10, function (err, reply) {
    console.log(err, "XTRIM");
});
*/

