const mongoose = require('mongoose');
const db = require('../model/blog')
const user = require('../model/database')
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// create post
exports.create = async (req, res) => {

    const img = (req.file) ? req.file.filename : null
    console.log(req.file);

    let exitinguser;
    try {
        exitinguser = await user.findById(req.body.author)
        console.log(exitinguser);
    } catch (error) {
        console.log(error.message);
    }
    if (!exitinguser) {
        res.json({ message: "not found" })
    }
    const post = new db({
        author: req.body.author,
        title: req.body.title,
        decr: req.body.decr,
        img
    })
    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        const newpost = await post.save({ session })
        exitinguser.blogs.push(post)
        await exitinguser.save({ session })
        await session.commitTransaction()
        res.send(newpost)
    } catch (error) {
        res.send("uploading fail")
    }

}


// Read All the Post
exports.getall = async (req, res) => {
    try {
        const blogs = await db.find({}).populate('author')
        res.send(blogs)
    } catch (error) {
        res.json({ message: "blogs not found " })
    }
}

// Read particular Post
exports.getone = async (req, res) => {
    try {
        const id = req.params['id']
        console.log(id);
        const blog = await db.findById(id).populate('author')
        let filename = blog.img
        let adress = path.join(__dirname, '../', 'upload', filename)
        console.log(adress);
        res.send({ blog, adress })
    } catch (error) {
        console.log(error.message)
    }
}

// delete the post
exports.delete = async (req, res) => {
    const id = req.params['id']
    let exitingpost
    let author;
    try {
        exitingpost = await db.findByIdAndRemove(id)
        author = exitingpost.author;
        let filename = exitingpost.img
        let adress = path.join(__dirname, '../', 'upload', filename)
        console.log(adress);
        fs.unlink(adress, (err) => {
            console.log(err);
        })
        let exist = await user.findByIdAndUpdate({ _id: author }, {
            $pull: {
                blogs: id
            }
        })
        res.send("successfully deleted")
    } catch (error) {
        console.log(error.message);
    }

}


// Update the Post
exports.update = async (req, res, next) => {
    const id = req.params['id']
    console.log(id);
    console.log(req.body.title);
    try {
        const post = await db.findByIdAndUpdate({ _id: id }, {
            title: req.body.title,
            decr: req.body.decr
        })
        const edit = db.findById(id)
        res.send('update')
    } catch (error) {
        console.log(error.message);
    }
}