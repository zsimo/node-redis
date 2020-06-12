var path = require("path");
var client = require(path.resolve(process.cwd(), "redis"));
const { promisify } = require("util");
var transaction = client.multi();
const EXEC_TRANSACTION = promisify(transaction.EXEC).bind(transaction);

async function run () {


    transaction.set("ciao", 1);
    transaction.get("ciao");

    var result = await EXEC_TRANSACTION();
    console.log(result);

    client.quit();

}



try {
    run();
} catch (e) {
    console.error(e);
}