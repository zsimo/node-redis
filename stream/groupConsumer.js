"use strict";

var args = process.argv.slice(2);
var path = require("path");
var fs = require("fs");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));
var uniqueConsumerName = args[0];
if (!uniqueConsumerName) {
    throw new Error("consumer name is mandatory");
}
var error = false;
var timeoutId;

const ID = 0;
const RESPONSE = 1;
const KEY = 0;
const VALUE = 1;
const RETRY_TIMEOUT = 5000; // in ms

var DELIVERY_STRATEGIES = Object.freeze({
    PENDING: 0,
    NEW: ">" // never delivered
});

const { promisify } = require("util");
// promisify redis functions in order to use async/await sintax
const XACK = promisify(client.XACK).bind(client);
const XDEL = promisify(client.XDEL).bind(client);
const XPENDING = promisify(client.XPENDING).bind(client);
const XREADGROUP = promisify(client.XREADGROUP).bind(client);

async function consume () {

    try {

        var strategy = DELIVERY_STRATEGIES.NEW;
        var pending = await XPENDING(config.stream_name, config.group_name);

        var numberOfPending = pending[0];
        console.log("pending " + numberOfPending);
        /**
         * Consume all the pending messages (if any) and then the BLOCK waiting for the new ones.
         * @see https://redis.io/commands/xreadgroup last chapter
         */
        if (numberOfPending > 0) {
            strategy = DELIVERY_STRATEGIES.PENDING;
        }

        // "BLOCK", 0 means block forever until a new item (if the strategy = ">", otherwise BLOCK will be ignored)
        client.XREADGROUP("GROUP", config.group_name, uniqueConsumerName, "BLOCK", 0, "STREAMS", config.stream_name, strategy, _readTheStream);

    } catch(e) {

        // create the group if not exists
        client.XGROUP("CREATE", config.stream_name, config.group_name, 0, function (err, reply) {
            console.log("group created",  config.group_name, reply);
        });
        
    }

}

// do something with the item pulled out from the stream
async function _readTheStream (err, reply) {
    try {

        if (error === true) {
            return;
        }
            
        var items = reply[0][1];

        for (var i = 0; i < items.length; i += 1) {
            var item = items[i];
            var id = item[ID];
            var response = item[RESPONSE];
            var key = response[KEY];
            var value = response[VALUE];

            // do some operation with the value...
            console.log("value from the stream", value);
            fs.readFileSync(path.resolve(__dirname, "test.txt"));

            // then tell redis that the item has been processed
            var xackResult = await XACK(config.stream_name, config.group_name, id);

            // and finally remove the item from the stream
            var xdelResult = await XDEL(config.stream_name, id);
            
            error = false;
            clearTimeout(timeoutId);
        }

    } catch (e) {
        console.error(e);
        error = true;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            error = false;
            consume();
        }, RETRY_TIMEOUT);

     }

     consume();
   
}


consume();