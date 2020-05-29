"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));

function consume () {

    // 0 means block forever until a new item
    // 0 means give me everything from beginning or $ means give me only new items
    client.XREAD ("BLOCK", 0, "STREAMS", config.stream_name, 0, function (err, reply) {
        var id = reply[0][1][0][0];
        console.log(err, JSON.stringify(reply, null, 2));

        // do some operation, eg: insert in the db

        // and only if the operation is ok, remove the item from the stream
        client.XDEL(config.stream_name, id, function (err, reply) {
            console.log(err, JSON.stringify(reply));
            consume();
        });


    });



}

consume();