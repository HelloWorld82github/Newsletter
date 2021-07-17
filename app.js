const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();
mongoose.connect('mongodb://localhost:27017/newsletter', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useUnifiedTopology', true);

app.use(express.urlencoded());
app.use(express.static("public"));
app.set('view engine', 'ejs');


let posts = [];

app.get("/", function(req, res){
    res.render('titlepage', {
        posts: posts
    });
});

// Compose and post into title page //

app.get("/compose", function(req, res){
    res.render('empty_template', {});
});

app.post("/compose", function(req, res){
    // titleBlogPost = req.body.title;
    // contentBlogPost = req.body.content;
    // res.redirect("/blogpost_template");
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };

    posts.push(post);
    res.redirect("/");
});


app.get("/posts/:postName", function(req, res){
    const requestedTitle = _.lowerCase(req.params.postName);

    posts.forEach(function(post){
        var storedTitle = _.lowerCase(post.title);

        if(storedTitle === requestedTitle) {
            res.render('blogpost_template',
            { title: post.title, 
              content: post.content
            });
        } 
    });
});

//       //

// Subscribe //

app.get("/subscribe", function(req, res){
    res.sendFile(__dirname + "/subscribe.html");
});

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

    // Subscribed //

app.listen(3000, function(req,res){
    console.log("Server running on port 3000");
})