const Post = require("../model/post")


exports.createPosts = (req, res, next) => {

  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userid
  });
  post.save().then((posts) => {
    res.status(201).json({
      message: 'Post Added Successfully',
      post: {
        ...posts,
        postId: posts._id,

      }

    })
  }).catch(e => {
    res.status(500).json({
      message: "Creating a Post Failed"
    })
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  let fetchPosts;
  const postQuery = Post.find()
  console.log(pageSize * (currentPage - 1));
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.
    then(documents => {
      fetchPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: 'success',
        posts: fetchPosts,
        maxPosts: count
      })
    }).catch(e => {
      res.status(500).json({
        message: "Fetching post failed!"
      })
    })
}


exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  }).catch(e => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  })
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userid
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userid }, post).then((result) => {
    if (result.n > 0) {
      res.status(200).json({ message: "updated Successfully" });
    } else {
      res.status(401).json({ message: "Unauthorized user" });
    }
  }).catch(e => {
    res.status(500).json({
      message: "Couldn't update post!"
    })
  });
}


exports.deletePost=(req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userid }).then((result) => {
    if (result.n > 0) {
      res.status(201).json({
        message: "Post deleted!"
      })
    } else {
      res.status(401).json({
        message:"Unauthorzed user"});
    }
  }).catch(e=>{
    res.status(500).json({
      message:"Deleting record failed!"
    })
  })

}



