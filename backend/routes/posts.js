const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    distination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null
        }
        cb(error, 'backend/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.get('', multer(storage).single('image') ,(req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            })
        })
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({message: 'Post not found'});
            }
        })
});

router.post("", (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
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

router.delete('/:id', (req, res, next) => {

    Post.deleteOne({_id: req.params.id})
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Post deleted'
            });
        })
});

module.exports = router;