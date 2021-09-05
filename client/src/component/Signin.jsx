import React, { useState, useContext } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import { userContext } from "../App";
import { useAlert } from 'react-alert'


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

const Signin = () => {
  const { dispatch } = useContext(userContext);
  const classes = useStyle();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const alert = useAlert();

  const addUserDetails = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert.error(data.error);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          
          alert.success("Login Successful");
          history.push("/");
        }
      });
  };
  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Login</Typography>

      <FormControl>
        <InputLabel>Email</InputLabel>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          value={email}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Password</InputLabel>
        <Input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          value={password}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={() => addUserDetails()}
      >
        Login
      </Button>
      
    </FormGroup>
  );
};

export default Signin;
