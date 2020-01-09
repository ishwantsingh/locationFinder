import { combineReducers } from "redux";

import setUserReducer from "./setUserReducer";
import authReducer from "./authReducer";
//import { sendMessageReducer } from "./newMessageReducer";

const rootReducer = combineReducers({
  authInfo: authReducer,
  setUser: setUserReducer
  //  sentMessageStatus: sendMessageReducer
});

export default rootReducer;
