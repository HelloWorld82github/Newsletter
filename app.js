const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const mongoose = require("mongoose");
const _ = require('lodash');


const app = express();

app.use(express.urlencoded());
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://admin_mridula:pLAPTOP2004@newsletter1.a6k9k.mongodb.net/newsletter', {useNewUrlParser: true});

let id = 0;

const newPostSchema = {
    id : String,
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    }
};

const Post = mongoose.model("Post", newPostSchema);
// const post1 = new Post ({
//     title : "Hasan Minhaj, Comedian 2.0",
//     content : "Hasan Minhaj's Patriot Act is deeply missed."
// });
// const post2 = new Post({
//     title : "Homecoming King",
//     content : "Hasan Minhaj's brilliant comedy special!!"
// });

//let posts = [];

app.get("/", function(req, res){
    // Post.findById(requiredId, function(err, post){
    //     if(err) console.log(err);
    //     else {
    //         res.render('titlepage',
    //         {
    //             title : post.title,
    //             content : post.content,
    //             posts: posts
    //         });
    //     }
    // });
    Post.find({}).sort([['id', -1]]).limit(1).exec(function(err, posts){
        if(!err) {
            posts.forEach(function(post) {
                // console.log(post.content);
                // console.log(post.title);
                res.render('titlepage', {
                    title: post.title,
                    content: post.content,
                    posts: posts
                });
            });
        };
    });

    // Post.find({}, function(err, post){
    //     if(err) console.log(err);
    //     else {
    //         res.render('footer', {
    //             posts : post
    //         });
    //     }
    // });
});

// Compose and post into title page //

app.get("/compose", function(req, res){
    res.render('empty_template', {});
});

app.post("/compose", function(req, res){
    let titleName = _.capitalize(req.body.postTitle);
    let contentName = req.body.postBody;
    let idName = req.body.postId;
    const post = new Post({
        id : idName,
        title : titleName,
        content : contentName
    })
    post.save(function(err){
        if(err) console.log(err);
        else res.redirect("/");
    });

    // posts.push(post);
    // res.redirect("/");
});


app.get("/posts/:postId", function(req, res){
    const requestedId = req.params.postId;

    Post.findById(requestedId, function(err, post){
        if(err) console.log(err);
        else {
            console.log(post);
            console.log(post.content);
            res.render('blogpost_template',
            {
                title : post.title,
                content : post.content
            });
        }
    });
    // posts.forEach(function(post){
    //     var storedTitle = _.lowerCase(post.title);

    //     if(storedTitle === requestedTitle) {
    //         res.render('blogpost_template',
    //         { title: post.title, 
    //           content: post.content
    //         });
    //     } 
    // });
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