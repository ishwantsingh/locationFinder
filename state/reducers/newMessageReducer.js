import {
  NEW_MES_SENT,
  NEW_MES_ERR,
  SENDING_NEW_MES
} from "../actions/newMessageAction";

const initialState = {
  docId: "",
  sendErr: null,
  sendingMessage: false
};

export function sendMessageReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_MES_SENT:
      return { ...state, docId: action.payload.docId, sendingMessage: false };
    case NEW_MES_ERR:
      return { ...state, sendErr: action.payload, sendingMessage: false };
    case SENDING_NEW_MES:
      return { ...state, sendingMessage: true };
    default:
      return state;
  }
}
