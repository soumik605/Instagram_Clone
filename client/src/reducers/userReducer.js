export const initialState = null;
export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return action.payload;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      followings: action.payload.followings,
    };
  }
  if (action) {
    return state;
  }
};
