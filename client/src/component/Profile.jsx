import React, { useContext, useEffect,useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import { userContext } from "../App";

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
  const [data, setData] = useState([])
  
  const {state} = useContext(userContext)

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

  return (
    <div className={classes.root}>
      <div className={classes.mydetails}>
        <Avatar alt="SRemy Sharp" src="/static/images/avatar/1.jpg" />
        <h1>{state? state.name: "loading.."}</h1>
        <h3 style={{fontFamily:'Dancing Script'}}>{state? state.email: "loading.."}</h3>
        <ButtonGroup
          variant="text"
          color="primary"
          aria-label="text primary button group"
        >
          <Button>Posts : {data.length}</Button>
          <Button>Followers : {state ? state.followers.length : "Loading.."}</Button>
          <Button>Following : {state ? state.followings.length : "Loading.."}</Button>
        </ButtonGroup>
      </div>

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
