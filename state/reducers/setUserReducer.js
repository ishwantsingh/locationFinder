import {
  SETTING_USER,
  SET_USER_SUCCESS,
  SET_USER_ERROR
} from "../actions/setUserAction";

const initialState = {
  data: [],
  setUserError: null,
  settingUser: false
};

export default function setUserReducer(state = initialState, action) {
  switch (action.type) {
    case SETTING_USER:
      return {
        ...state,
        settingUser: true
      };
    case SET_USER_SUCCESS:
      return {
        ...state,
        settingUser: false,
        data: action.payload
      };
    case SET_USER_ERROR:
      return {
        ...state,
        settingUser: false,
        setUserError: action.payload
      };
    default:
      return state;
  }
}
