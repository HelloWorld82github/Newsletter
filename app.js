const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.urlencoded());
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", function(req, res){
    res.render('titlepage', {
        titleOfToday : 'Hasan Minaj: Comedian 2.0'
    });

});


app.listen(3000, function(req,res){
    console.log("Server running on port 3000");
})