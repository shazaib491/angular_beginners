const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
const postRoute = require("./routes/posts");
const userRoute = require("./routes/user")
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://shazaib:hD8iOjzpBLHnriUX@cluster0.4xlvm.mongodb.net/node-angular?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
).then(() => {
  console.log("Connected To the Database");
}).catch((e) => {
  console.log(e);
})

// hD8iOjzpBLHnriUX
app.use(cors());
app.use("/images", express.static(path.join("backend/images")))
app.use(express.json())
app.use("/api/posts", postRoute)
app.use("/api/user", userRoute)



module.exports = app;
