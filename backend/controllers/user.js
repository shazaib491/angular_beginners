const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user.save()
      .then((result) => {
        res.status(201).json({
          message: "user created",
          result: result
        })
      }).catch((err) => {
        res.status(500).json({
          message: "Invalid Authorisation Credentials!"
        }
        )
      })
  })
}


exports.userLogin = (req, res, next) => {
  let fetchUser;
  User.findOne({ email: req.body.email }).then(user => {
    fetchUser = user;
    if (!user) {
      return res.status(401).json({
        message: "Authentication Failed"
      })
    }
    return bcrypt.compare(req.body.password, user.password)
  }).then(result => {

    if (!result) {
      return res.status(401).json({
        message: "Authentication Failed"
      })
    }
    const token = jwt.sign({ email: fetchUser.email, userId: fetchUser._id },process.env.JWT_KEY, {
      expiresIn: "1h"
    })

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userid: fetchUser._id
    })
  }).catch(err => {
    return res.status(401).json({
      message: "Invalid Authentication Credentials!"
    })
  })
}
