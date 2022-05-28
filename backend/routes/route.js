const express = require('express');
const body = require('body-parser')
const app = express.Router()
const route = require('../controller/controller')


const create = app.post('/create',body.json(),route.createuser)
const getall = app.get('/users',body.json(),route.getalldata)  // not so usefull only for practice purpose
const login = app.post('/login',body.json(),route.login)
const verify = app.get('/verify',body.json(),route.verifytoken,route.getdata) //verify during login
const id = app.get('/user/:id',body.json(),route.getbyid)
const logout = app.get('/logout',body.json(),route.logout) //logout user
const verification = app.get('/verification/:id',body.json(),route.verification,route.getverify) // verification during registration

module.exports = {create,getall,login,verify,verification,logout}