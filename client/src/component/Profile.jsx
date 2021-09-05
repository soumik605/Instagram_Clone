import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import EditIcon from "@material-ui/icons/Edit";
import { userContext } from "../App";
import { Link, useHistory } from "react-router-dom";
import "../CSS/PopStyle.css";
import { useAlert } from "react-alert";

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
    maxWidth: 500,
  },
}));

const Profile = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingsList, setFollowingsList] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    fetch("/mypost", {
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
    if (state) {
      fetch(`/user/${state._id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          const followlist = res.user.followers.map((person) => {
            return person;
          });
          setFollowersList(followlist);
          const followlist2 = res.user.followings.map((person) => {
            return person;
          });
          setFollowingsList(followlist2);
        });
    }
  }, [state]);

  const followUser = (userid) => {
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
        dispatch({
          type: "UPDATE",
          payload: {
            followers: res.result.followers,
            followings: res.result.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.result));
        alert.show("You are now following " + res.result1.name);
      });
  };

  const unfollowUser = (userid) => {
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
        dispatch({
          type: "UPDATE",
          payload: {
            followers: res.result.followers,
            followings: res.result.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(res.result));
        alert.show("You just unfollow " + res.result1.name);
      });
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={classes.root}>
      <div className={classes.mydetails}>
        <Avatar alt={state && state.name} src="/static/images/avatar/1.jpg" />
        <Link style={{ float: "right" }} to="/edituser">
          <EditIcon />
        </Link>
        <h1>{state ? state.name : "loading.."}</h1>
        <h3 style={{ fontFamily: "Dancing Script" }}>
          {state ? state.email : "loading.."}
        </h3>
        <ButtonGroup
          variant="text"
          color="primary"
          aria-label="text primary button group"
        >
          <Button>Posts : {data.length}</Button>
          <Button onClick={() => togglePopup()}>
            Followers : {state ? state.followers.length : "Loading.."}
          </Button>
          <Button onClick={() => togglePopup()}>
            Following : {state ? state.followings.length : "Loading.."}
          </Button>
        </ButtonGroup>
      </div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <span className="close-icon" onClick={() => togglePopup()}>
              x
            </span>
            <div>
              <b>Followers List</b>
              <ol>
                {followersList &&
                  followersList.map((user) => (
                    <li key={user._id} style={{ margin: "10px" }}>
                      <Link
                        to={`/profile/${user._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {user.name}
                      </Link>
                      {state.followings.includes(user._id) ? (
                        <Button
                          style={{ float: "right", fontSize: "10px" }}
                          onClick={() => unfollowUser(user._id)}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          style={{ float: "right", fontSize: "10px" }}
                          onClick={() => followUser(user._id)}
                        >
                          Follow Back
                        </Button>
                      )}
                    </li>
                  ))}
              </ol>
              <b>Followings List</b>
              <ol>
                {followingsList &&
                  followingsList.map((user) => (
                    <li key={user._id} style={{ margin: "10px" }}>
                      <Link
                        to={`/profile/${user._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {user.name}
                      </Link>
                      {state.followings.includes(user._id) ? (
                        <Button
                          style={{ float: "right", fontSize: "10px" }}
                          onClick={() => unfollowUser(user._id)}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          style={{ float: "right", fontSize: "10px" }}
                          onClick={() => followUser(user._id)}
                        >
                          Follow
                        </Button>
                      )}
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      )}
      <div className={classes.photo}>
        <ImageList rowHeight={160} className={classes.imageList} cols={3}>
          {data.map((item) => (
            <ImageListItem key={item._id} cols={item.cols || 1}>
              <img src={item.photo} alt={item.title} />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
};

export default Profile;
