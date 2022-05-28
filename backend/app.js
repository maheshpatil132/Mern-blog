const express = require('express');
const mongoose = require('mongoose');
const body = require('body-parser');
const cors = require('cors');
const routes = require('./routes/route')
const posts = require('./routes/blogs')
const path = require('path');
const { dirname } = require('path');
const app = express()

// app.use(express.json())
app.use(body.urlencoded({extended:true}))
app.use(cors({credentials:true,origin:'http://localhost:3000'}))

app.use(express.static(path.join(__dirname,'../','upload')))
app.use(express.static('upload'))

app.use(routes.create)
app.use(routes.getall)
app.use(routes.login)
app.use(routes.logout)
app.use(routes.verify)
app.use(routes.verification)

app.use(posts.create)
app.use(posts.getall)
app.use(posts.getone)
app.use(posts.remove)
app.use(posts.update)

mongoose.connect('mongodb+srv://mahesh:mahesh@cluster0.hidqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(()=>{
    app.listen(5000,res=>{console.log("server is running")})
}).catch(err=>{console.log(err)})
