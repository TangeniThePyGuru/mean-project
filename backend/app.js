/**
 * Created by tshikomba on 8/7/2018.
 */
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require('./models/post')

const app = express();
// connects us to our mongo database
mongoose.connect("mongodb+srv://admin:zDGY9lDDM4dmAsOX@cluster0-9tywo.mongodb.net/node-angular?retryWrites=true")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch((error) => {
        console.log('Connection failed!\nError: '+error)
    })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post("/api/posts", (req, res, next) => {
    //mongoose automatically adds the id attribute for us
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    // console.log(post);
    // 201 resource was created
    res.status(201).json({
        message: 'Post added successfully'});
})

app.get('/api/posts' ,(req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            })
        })
});

module.exports = app;