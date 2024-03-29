const express = require("express");

const app = express();
const port = 3000;

app.use("/", express.static(__dirname + "/dist"));
app.use("/settings", express.static(__dirname + "/dist"));
app.use("/chat", express.static(__dirname + "/dist"));
app.use("/login", express.static(__dirname + "/dist"));
app.use("/sign-up", express.static(__dirname + "/dist"));
app.use("/404", express.static(__dirname + "/dist"));
app.use("/500", express.static(__dirname + "/dist"));

app.listen(port, () => {
    console.info('Server started')
});