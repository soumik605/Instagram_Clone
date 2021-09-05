import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Button,
} from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import "../App.css";
import { userContext } from "../App";
import InstagramIcon from '@material-ui/icons/Instagram';

const useStyle = makeStyles({
  header: {
    background: "green",
  
  },
  tabs: {
    color: "white",
    textDecoration: "none",
    margin: 10,
  },
  title: {
    flexGrow: 1,
    fontFamily: "Grand Hotel",
    fontSize: 40,
    textDecoration: "none",
  },
});

const Navbar = () => {
  const { state, dispatch } = useContext(userContext);
  const classes = useStyle();
  const history = useHistory() 

  const RenderList = () => {
    if (!state) {
      return [
        <NavLink key="login" className={classes.tabs} to="/signin" exact>
          Login
        </NavLink>,
        <NavLink key="signup" className={classes.tabs} to="/signup" exact>
          Signup
        </NavLink>,
      ];
    } else {
      return [
        <NavLink key="explore" className={classes.tabs} to="/explore" exact>
          Explore
        </NavLink>,
        <NavLink key="profile" className={classes.tabs} to="/profile" exact>
        Profile
      </NavLink>,
        <NavLink key="createpost" className={classes.tabs} to="/createpost" exact>
          Create Post
        </NavLink>,
        <Button key="logout" className={classes.tabs} variant="contained" color="secondary" onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push("/signin")
        }}>
          Logout
        </Button>,
      ];
    }
  };
  return (
    <AppBar className={classes.header} position="fixed">
      <Toolbar style={{paddingRight: 0}}>
        
        <NavLink className={classes.title}  to={state ? "/" : "/signin"} exact><InstagramIcon style={{width:"20px"}}/></NavLink>
        {RenderList()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
