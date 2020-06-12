var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
var pipeline = client.batch();
const EXEC_PIPELINE = promisify(pipeline.EXEC).bind(pipeline);

async function run () {


    // pipeline.set("ciao", 1);
    // pipeline.get("ciao");
    //
    // var result = await EXEC_PIPELINE();
    // console.log(result);


    const key = 'hw2.5';
    pipeline.set(key, 3);
    pipeline.incrby(key, 3);
    pipeline.get(key);

    var result = await EXEC_PIPELINE();
    console.log(result);
    client.quit();
}



try {
    run();
} catch (e) {
    console.error(e);
}