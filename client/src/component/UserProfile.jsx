import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import { userContext } from "../App";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    padding: 10,
    margin: 20,
    border: "1px solid black",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "50px",
  },
  mydetails: {
    padding: 10,
    margin: 10,
    border: "1px solid black",
  },
  photo: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    overflow: "hidden",
  },
  imageList: {
    width: 500,
    height: 450,
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const { state, dispatch } = useContext(userContext);
  const { userid } = useParams();

  useEffect(() => {
    console.log(userid);
    fetch(`/user/${userid}`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followid: userid,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res.result);
        console.log(res.result1);
        dispatch({
          type: "UPDATE",
          payload: {
            followers: res.result.followers,
            followings: res.result.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.result));
        setData({ ...data, user: res.result1 });
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followid: userid,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res.result);
        console.log(res.result1);
        dispatch({
          type: "UPDATE",
          payload: {
            followers: res.result.followers,
            followings: res.result.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.result));
        setData({ ...data, user: res.result1 });
      });
  };

  return (
    <>
      {data ? (
        <div className={classes.root}>
          <div className={classes.mydetails}>
            <Avatar alt="SRemy Sharp" src="/static/images/avatar/1.jpg" />
            <h1>{data ? data.user.name : "loading.."}</h1>
            <h3 style={{fontFamily:'Dancing Script'}}>{data ? data.user.email : "loading.."}</h3>
            <ButtonGroup
              variant="text"
              color="primary"
              aria-label="text primary button group"
            >
              <Button>Posts : {data.posts.length}</Button>
              <Button>Followers : {data.user.followers.length}</Button>
              <Button>Following : {data.user.followings.length}</Button>
            </ButtonGroup>
            {data.user.followers.includes(state._id) ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => unfollowUser()}
              >
                Unfollow
              </Button>
            ) : state.followers.includes(data.user._id) ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => followUser()}
              >
                Follow Back
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => followUser()}
              >
                Follow
              </Button>
            )}
          </div>

          <div className={classes.photo}>
            <ImageList rowHeight={160} className={classes.imageList} cols={3}>
              {data.posts.map((item) => (
                <ImageListItem key={item._id} cols={item.cols || 1}>
                  <img src={item.photo} alt={item.title} />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        </div>
      ) : (
        <h1>
          <br />
          Loading...
        </h1>
      )}
    </>
  );
};

export default UserProfile;
