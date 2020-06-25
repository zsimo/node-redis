"use strict";

var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
var config = require(path.resolve(__dirname, "config"));

function consume () {

    // RPOP remove and returns the last element in a list
    client.BRPOP(config.queue_name, 0, async function (err, reply) {

        try {

            console.log(err, reply);

        } catch (error) {

            console.error(error);

        }

        consume();


    });
}


consume();