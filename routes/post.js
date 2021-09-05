const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.post("/createpost", requireLogin, (req, res) => {
  const { title, desc, photo } = req.body;
  console.log(title, desc, photo);
  if (!title || !desc || !photo) {
    res.status(422).json({ error: "Please Fill All Fields" });
  } else {
    req.user.password = undefined;
    const post = new Post({
      title,
      desc,
      photo,
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        res.json({ post: result });
      })
      .catch((err) => console.log(err));
  }
});

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name email")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/allsubpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.followings } })
    .populate("postedBy", "_id name email followers followings")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name email")
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name email")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        res.send(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name email")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        res.send(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name email")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/delete/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (req.user._id.toString() === post.postedBy._id.toString()) {
        post
          .remove()
          .then((resp) => res.json({ resp }))
          .catch((err) => console.log(err));
      }
    });
});

router.put("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name email")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      } else {
        post.comments.map((cmnt) => {
          if (cmnt._id.toString() === req.params.commentId.toString()) {
            if (cmnt.postedBy._id.toString() === req.user._id.toString()) {
              Post.findByIdAndUpdate(
                req.params.postId,
                {
                  $pull: { comments: cmnt },
                },
                {
                  new: true,
                }
              )
                .populate("comments.postedBy", "_id name")
                .populate("postedBy", "_id name email")
                .exec((err, result) => {
                  if (err) {
                    res.status(422).json({ error: err });
                  } else {
                    res.send(result);
                  }
                });
            }
          }
        });
      }
    });
});

module.exports = router;
