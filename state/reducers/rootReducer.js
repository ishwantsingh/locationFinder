import { combineReducers } from "redux";

import setUserReducer from "./setUserReducer";
import authReducer from "./authReducer";
import { setLocReducer } from "./newMessageReducer";

const rootReducer = combineReducers({
  authInfo: authReducer,
  setUser: setUserReducer,
  setLocReducer: setLocReducer
});

export default rootReducer;
