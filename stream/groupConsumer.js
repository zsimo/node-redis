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

var errorCounter = 0;

const { promisify } = require("util");
// promisify redis functions in order to use async/await sintax
const XACK = promisify(client.XACK).bind(client);
const XDEL = promisify(client.XDEL).bind(client);

// consume every previous unprocessed items (if any)
client.XREADGROUP ("GROUP", config.group_name, uniqueConsumerName, "BLOCK", 0, "STREAMS", config.stream_name, 0, _process);

// consume every new items
function consume () {
    // 0 means block forever until a new item
    // 0 means give me everything from beginning or ">" receive only messages that were never delivered to any other consumer
    client.XREADGROUP ("GROUP", config.group_name, uniqueConsumerName, "BLOCK", 0, "STREAMS", config.stream_name, ">", _process);
}

// do something with the item pulled out from the stream
async function _process (err, reply) {
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

            // throw new Error("ciao");
            // then tell redis that the item has been processed
            var xackResult = await XACK(config.stream_name, config.group_name, id);

            // and finally remove the item from the stream
            var xdelResult = await XDEL(config.stream_name, id);
            
        }

    } catch (e) {
        errorCounter += 1;
        // in case of too many errors (e.g.: redis-cli flushall) exit the process
        // and let pm2 to reload it
        if (errorCounter > 1000) {
            process.exit();
        }
     }
     consume();
   
}

client.XGROUP("CREATE", config.stream_name, config.group_name, 0, function (err, reply) {
    console.log(err, reply);
});


consume();