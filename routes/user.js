const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.get("/alluser", requireLogin, (req, res) => {
  User.find()
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/user/:userid", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userid })
    .select("-password")
    .populate("followers","_id name email")
    .populate("followings","_id name email")
    .then((user) => {
      Post.find({ postedBy: req.params.userid })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          } else {
            res.json({ user, posts });
          }
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: err });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followid,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result1) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        User.findByIdAndUpdate(
          req.user._id,
          {
            $push: { followings: req.body.followid },
          },
          {
            new: true,
          }
        )
          .then((result) => res.json({ result, result1 }))
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followid,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result1) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { followings: req.body.followid },
          },
          {
            new: true,
          }
        )
          .then((result) => {
            res.json({ result, result1 });
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    }
  );
});

router.put("/edituserdetails", requireLogin, (req, res) => {
  const { _id, name, email } = req.body;

  if (!email || !name) {
    return res.status(422).json({ error: "Please add all fields" });
  } else {
    User.findByIdAndUpdate(
      _id,
      {
        name,
        email,
      },
      {
        new: true,
      }
    )
      .then((user) => {
        console.log(user);
        res.send(user);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  }
});


module.exports = router;
