var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
const GEOADD = promisify(client.GEOADD).bind(client);
const GEORADIUS = promisify(client.GEORADIUS).bind(client);

async function run () {

    var name = "sites:geo";
    var reply = await GEOADD(name, -122.147, 37.670, 56);
    console.log(reply);
    reply = await GEOADD(name, -122.007, 37.550, 101);
    console.log(reply);
    reply = await GEORADIUS(name, -122.271, 37.804, 1, "km");
    console.log(reply);
    reply = await GEORADIUS(name, -122.271, 37.804, 50, "km", "WITHDIST", "WITHCOORD");
    console.log(reply);


    client.quit();

}



try {
    run();
} catch (e) {
    console.error(e);
}