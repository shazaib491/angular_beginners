const express = require('express');
const route = express.Router();
const checkAuth = require("../midddleware/check-auth");
const { createPosts, getPosts, getPost, updatePost, deletePost } = require("../controllers/post")
const exractFile = require("../midddleware/file")


route.post("", checkAuth, exractFile, createPosts)

route.get("", getPosts)

route.get("/:id", getPost)

route.put("/:id", checkAuth, exractFile, updatePost)

route.delete("/:id", checkAuth, deletePost)

module.exports = route;
