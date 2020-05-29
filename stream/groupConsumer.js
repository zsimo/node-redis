"use strict";

var args = process.argv.slice(2);
var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));
var uniqueConsumerName = args[0];
if (!uniqueConsumerName) {
    throw new Error("consumer name is mandatory");
}

function consume () {



    // 0 means block forever until a new item
    // 0 means give me everything from beginning or > never provided to other workers
    client.XREADGROUP ("GROUP", config.group_name, uniqueConsumerName, "BLOCK", 0, "STREAMS", config.stream_name, ">", function (err, reply) {
        try {
            var id = reply[0][1][0][0];
            console.log(err, JSON.stringify(reply, null, 2));
            // console.log(id)
        
            client.XACK(config.group_name, uniqueConsumerName, id, function (err, reply) {
                console.log(err, "XACK");
    
                client.XDEL(config.stream_name, id, function (err, reply) {
                    console.log(err, "XDEL");
                    consume();
                });
                
            
            });
        } catch (e) {
            consume();
        }

        

        
    });
    
}



client.XCLAIM(config.stream_name, config.group_name, uniqueConsumerName, 0, 0, function (err, reply) {
    console.log(err, JSON.stringify(reply, null, 2));
});

client.XGROUP("CREATE", config.stream_name, config.group_name, 0, function (err, reply) {
    console.log(err, reply);
});


consume();