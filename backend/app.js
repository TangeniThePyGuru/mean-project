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
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

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

app.get("/api/posts/:id", (req, res, next) => {
   Post.findById(req.params.id)
       .then((post) => {
           if (post) {
                res.status(200).json(post);
           } else {
                res.status(404).json({message: 'Post not found'});
           }
        })
});

app.post("/api/posts", (req, res, next) => {
    //mongoose automatically adds the id attribute for us
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save()
        .then(createdPost => {
            // 201 resource was created
            res.status(201).json({
                message: 'Post added successfully',
                postId: createdPost._id
            });
        })

});

app.put('/api/posts/:id', (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post)
        .then(() => {
            res.status(200).json({
                message: 'Update successful'
            });
        })
})

app.delete('/api/posts/:id', (req, res, next) => {

    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Post deleted'
            });
        })
});

module.exports = app;