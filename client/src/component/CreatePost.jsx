import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  makeStyles,
  Typography,
  CardMedia,
} from "@material-ui/core";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

const useStyle = makeStyles({
  container: {
    width: "50%",
    margin: "5% 0 0 25%",
    marginTop: "50px",
    "& > *": {
      margin: 20,
    },
  },
});

const CreatePost = () => {
  const classes = useStyle();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [url, setUrl] = useState("");
  const history = useHistory();
  const alert = useAlert();

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          desc,
          photo: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert.error("Sorry, Something went wrong !!");
          } else {
            alert.success("Successfully Posted !!");
            history.push("/");
          }
        });
    }
  }, [url]);

  const postDetails = async () => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "soumik");
    await fetch("https://api.cloudinary.com/v1_1/soumik/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Add Post</Typography>

      <FormControl>
        <InputLabel>Title</InputLabel>
        <Input
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          value={title}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Description</InputLabel>
        <Input
          onChange={(e) => setDesc(e.target.value)}
          name="desc"
          value={desc}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Upload Image</InputLabel>
        <Input onChange={(e) => setImg(e.target.files[0])} type="file" />
      </FormControl>
      <Button variant="contained" color="primary" onClick={() => postDetails()}>
        Add Post
      </Button>
    </FormGroup>
  );
};

export default CreatePost;
