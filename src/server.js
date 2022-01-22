const  connect  = require("./configs/db");
const app = require("./index");
app.listen(3454, async () => {
    await connect();
    console.log("listning on port 3454");
});