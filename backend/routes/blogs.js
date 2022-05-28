const express = require('express');
const body = require('body-parser')
const app = express.Router()
const data = require('../controller/blogcontroll')
const multer = require('multer');
const path = require('path');
 const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'upload/')
        console.log("file uploading");
    },
    filename : function(req,file,callback){
        callback(null, Date.now() +'-' +file.originalname)
    }
})


const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
}

const upload = multer({
    storage:storage,
    fileFilter: fileFilter,
})

const create = app.post('/post',upload.single("image"),body.json(), data.create)
const getall = app.get('/blogs',body.json(), data.getall)
const getone = app.get('/:id',body.json(), data.getone)
const remove = app.delete('/remove/:id',body.json(),data.delete)
const update = app.put('/update/:id',body.json(),data.update)
module.exports = {create,getall,getone,remove,update}