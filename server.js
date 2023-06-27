const express = require("express");

const app = express();

app.use("/", express.static(__dirname + "/dist"));
app.use("/profile", express.static(__dirname + "/dist"));
app.use("/chats", express.static(__dirname + "/dist"));
app.use("/login", express.static(__dirname + "/dist"));
app.use("/registration", express.static(__dirname + "/dist"));

app.listen(80, () => {
    console.log('Server started')
});