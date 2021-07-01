const express = require("express");
const app = express();

app.use(express.urlencoded());
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index2.html");
})


app.listen(3000, function(req,res){
    console.log("Server running on port 3000");
})