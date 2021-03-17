const express = require("express");
const Route = express.Router();
const {createUser,userLogin}=require("../controllers/user")

Route.post("/singup",createUser)

Route.post("/login",userLogin)




module.exports = Route;
