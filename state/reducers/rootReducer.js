import { combineReducers } from "redux";

import setDataReducer from "./setDataReducer";
import authReducer from "./authReducer";
import { sendMessageReducer } from "./newMessageReducer";

const rootReducer = combineReducers({
  authInfo: authReducer,
  data: setDataReducer,
  sentMessageStatus: sendMessageReducer
});

export default rootReducer;
