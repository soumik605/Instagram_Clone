import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { userContext } from "../App";

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

const EditUserDetails = () => {
  const classes = useStyle();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  const alert = useAlert();
  const { state, dispatch } = useContext(userContext);

  const editUser = () => {
    fetch("/edituserdetails", {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        _id: state._id,
        name,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        dispatch({
          type: "USER",
          payload: data,
        });
        localStorage.setItem("user", JSON.stringify(data));
        history.push("/profile")
      });
  };

  useEffect(() => {
    if (state) {
      setName(state.name);
      setEmail(state.email);
    }
  }, [state]);

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Update User</Typography>
      <FormControl>
        <InputLabel>Name</InputLabel>
        <Input
          onChange={(e) => setName(e.target.value)}
          name="name"
          value={name}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Email</InputLabel>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          value={email}
        />
      </FormControl>
      {state && (
        <Button variant="contained" color="primary" onClick={() => editUser()}>
          Update User
        </Button>
      )}
    </FormGroup>
  );
};

export default EditUserDetails;
