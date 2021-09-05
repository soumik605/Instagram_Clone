import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./component/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./component/Home";
import Signin from "./component/Signin";
import Signup from "./component/Signup";
import Aboutus from "./component/Aboutus";
import Profile from "./component/Profile";
import CreatePost from "./component/CreatePost";
import { initialState, reducer } from "./reducers/userReducer";
import UserProfile from "./component/UserProfile";
import Explore from "./component/Explore";
import EditUserDetails from "./component/EditUserDetails";

export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(userContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/explore">
        <Explore />
      </Route>
      <Route exact path="/signin">
        <Signin />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/aboutus">
        <Aboutus />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/edituser">
        <EditUserDetails />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <userContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
