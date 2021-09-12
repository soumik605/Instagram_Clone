import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";
import { userContext } from "../App";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import "../CSS/loadingStyle.css";

import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    padding: 15,
    margin: 10,
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  media: {
    height: 0,
    paddingTop: "100%", // quare
  },
  avatar: {
    backgroundColor: red[500],
  },
  usercard: {
    display: "inline-block",
    width: "150px",
    margin: "15px",
    backgroundColor: "gray",
    color: "white",
    justifyContent: "center",
  },
  cmntlike: { fontSize: "15px", paddingLeft: "20px" },
}));

export default function Explore() {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [alluser, setAlluser] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const alert = useAlert();

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.result);
      });
  }, []);

  useEffect(() => {
    fetch("/alluser", {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let list = res.result;
        list = list.sort(() => Math.random() - 0.5);
        setAlluser(list);
      });
  }, []);

  const followUser = (user) => {
    fetch("/follow", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followid: user._id,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        dispatch({
          type: "UPDATE",
          payload: {
            followers: res.result.followers,
            followings: res.result.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.result));
        const newAllUser = alluser.map((user) => {
          if (user._id !== res.result1._id) {
            return user;
          } else {
            return res.result1;
          }
        });
        setAlluser(newAllUser);
        alert.show("You are now following " + user.name);
      });
  };

  const unfollowUser = (user) => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followid: user._id,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        dispatch({
          type: "UPDATE",
          payload: {
            followers: res.result.followers,
            followings: res.result.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.result));
        const newAllUser = alluser.map((user) => {
          if (user._id !== res.result1._id) {
            return user;
          } else {
            return res.result1;
          }
        });
        setAlluser(newAllUser);
        alert.show("You just unfollow " + user.name);
      });
  };

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        const newdata = data.map((item) => {
          if (item._id === res._id) {
            return res;
          } else {
            return item;
          }
        });
        setData(newdata);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        const newdata = data.map((item) => {
          if (item._id === res._id) {
            return res;
          } else {
            return item;
          }
        });
        setData(newdata);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        const newdata = data.map((item) => {
          if (item._id === res._id) {
            return res;
          } else {
            return item;
          }
        });
        setData(newdata);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postId) => {
    fetch(`/delete/${postId}`, {
      method: "delete",
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        const newData = data.filter((res) => {
          if (res._id !== result.message._id) {
            return res;
          } else {
            return null;
          }
        });

        setData(newData);
        alert.success("Post deleted !!");
      })
      .catch((err) => alert.error("Sorry, Something went wrong !!"));
  };

  const deleteComment = (itemId, commentId) => {
    fetch(`/deletecomment/${itemId}/${commentId}`, {
      method: "put",
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        const newData = data.map((res) => {
          if (res._id === result._id) {
            return result;
          } else {
            return res;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.root}>
      {alluser ? (
        <div
          style={{ whiteSpace: "nowrap", overflow: "auto", marginTop: "30px" }}
        >
          <div style={{ display: "inline-block" }}>
            <h4>Suggestions</h4>
            {alluser.map((user) => {
              return (
                state._id !== user._id && (
                  <Card className={classes.usercard} key={user._id}>
                    <CardContent style={{ textAlign: "center" }}>
                      <Avatar
                        alt="SRemy Sharp"
                        src="/static/images/avatar/1.jpg"
                        style={{ margin: "auto" }}
                      />
                      <Link
                        to={`/profile/${user._id}`}
                        style={{
                          textDecoration: "none",
                          color: "white",
                        }}
                      >
                        {user.name}
                      </Link>
                    </CardContent>
                    <CardActions style={{ justifyContent: "center" }}>
                      {user.followers.includes(state._id) ? (
                        <Button size="small" onClick={() => unfollowUser(user)}>
                          Unfollow
                        </Button>
                      ) : state.followers.includes(user._id) ? (
                        <Button size="small" onClick={() => followUser(user)}>
                          Follow Back
                        </Button>
                      ) : (
                        <Button size="small" onClick={() => followUser(user)}>
                          Follow
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                )
              );
            })}
          </div>
        </div>
      ) : (
        <div class="loader"></div>
      )}

      {data ? (
        data.map((item) => {
          const posttime1 = new Date(item.createdAt);
          const posttime = posttime1.toString();
          return (
            <Card className={classes.root} key={item._id}>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    R
                  </Avatar>
                }
                title={
                  <Link
                    to={
                      item.postedBy._id === state._id
                        ? `/profile`
                        : `/profile/${item.postedBy._id}`
                    }
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {item.postedBy.name}
                  </Link>
                }
                subheader={posttime}
              />

              {state._id !== item.postedBy._id &&
              state.followings.includes(item.postedBy._id) ? (
                <Button
                  style={{ float: "right" }}
                  onClick={() => unfollowUser(item.postedBy)}
                >
                  Following
                </Button>
              ) : state._id !== item.postedBy._id ? (
                <Button
                  style={{ float: "right" }}
                  onClick={() => followUser(item.postedBy)}
                >
                  Follow
                </Button>
              ) : (
                <DeleteIcon
                  style={{ float: "right" }}
                  onClick={() => deletePost(item._id)}
                />
              )}
              <CardContent>
                <h3 style={{ fontFamily: "Rock Salt" }}>{item.title}</h3>
              </CardContent>
              <CardMedia
                className={classes.media}
                image={item.photo}
                title={item.postedBy.name}
              />
              <CardContent>
                <h3>Desc : {item.desc}</h3>
              </CardContent>
              <CardActions disableSpacing>
                {item.likes.includes(state._id) ? (
                  <ThumbDownIcon onClick={() => unlikePost(item._id)} />
                ) : (
                  <ThumbUpIcon onClick={() => likePost(item._id)} />
                )}

                <h3>{item.likes.length} Likes</h3>
              </CardActions>
              {item.comments.map((comment) => {
                return (
                  <h5 key={comment._id}>
                    <span style={{ fontWeight: 400 }}>
                      {comment.postedBy.name} -{" "}
                    </span>
                    <span>{comment.text}</span>

                    <span>
                      {comment.postedBy._id === state._id && (
                        <DeleteIcon
                          style={{ float: "right" }}
                          onClick={() => deleteComment(item._id, comment._id)}
                        />
                      )}
                    </span>
                  </h5>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="Add a comment.." />
              </form>
            </Card>
          );
        })
      ) : (
        <div class="loader"></div>
      )}

      
    </div>
  );
}
