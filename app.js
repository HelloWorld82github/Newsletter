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

app.get("/blogpost_template", function(req, res){
    res.render('blogpost_template', {
        titleOfToday : 'Hasan Minaj: Comedian 2.0'
    });

});

app.get("/subscribe", function(req, res){
    res.sendFile(__dirname + "/subscribe.html");
})

client.setConfig({
    apiKey: "8e62312e76c94bbbe10fa2af9a88ae27-us6",
    server: "us6",
});

app.post("/subscribe", function(req, res){
    const firstName = req.body.first;
    const lastName = req.body.last;
    const emailId = req.body.useremail;

    //console.log(firstName);

    const listId = "f869d70b2c";
    //creating an object with the users data
    const data = {
        Fname: firstName,
        Lname: lastName,
        email: emailId
    };
    //uploading the data to the server
    const run = async() => {
        const response = await client.lists.addListMember("f869d70b2c", {
            email_address: data.email,
            status: "subscribed",
            merge_fields: {
                FNAME: data.Fname,
                LNAME: data.Lname
            }
        });
        // console.log(response);
        }
        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log("Successfully added contact as an audience member.");
    //Running this function and catching the errors (if any)

    run().catch(e => res.sendFile(__dirname + "/failure.html"));
        //run();
    } );


app.listen(3000, function(req,res){
    console.log("Server running on port 3000");
})