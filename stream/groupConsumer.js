"use strict";

var args = process.argv.slice(2);
var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));
var uniqueConsumerName = args[0];
if (!uniqueConsumerName) {
    throw new Error("consumer name is mandatory");
}

const ID = 0;
const RESPONSE = 1;
const KEY = 0;
const VALUE = 1;

const { promisify } = require("util");
// promisify redis functions in order to use async/await sintax
const XACK = promisify(client.XACK).bind(client);
const XDEL = promisify(client.XDEL).bind(client);

function consume () {

    // 0 means block forever until a new item
    // 0 means give me everything from beginning or > never provided to other workers
    client.XREADGROUP ("GROUP", config.group_name, uniqueConsumerName, "BLOCK", 0, "STREAMS", config.stream_name, ">", async function (err, reply) {
        try {
            
            var items = reply[0][1];

            for (var i = 0; i < items.length; i += 1) {
                var item = items[i];
                var id = item[ID];
                var response = item[RESPONSE];
                var key = response[KEY];
                var value = response[VALUE];

                // do some operation with the value...
                console.log("value from the stream", value);

                // then tell redis that the item has been processed
                var xackResult = await XACK(config.stream_name, config.group_name, id);

                // and finally remove the item from the stream
                var xdelResult = await XDEL(config.stream_name, id);
                
            }


        } catch (e) {
            console.error(e);
         }

         consume();
        
    });
    
}


/** 
client.XCLAIM(config.stream_name, config.group_name, uniqueConsumerName, 0, 0, function (err, reply) {
    console.log(err, JSON.stringify(reply, null, 2));
});
*/

client.XGROUP("CREATE", config.stream_name, config.group_name, 0, function (err, reply) {
    console.log(err, reply);
});


consume();