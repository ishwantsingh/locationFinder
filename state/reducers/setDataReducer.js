import {
  GET_DATA_SUCCESS,
  GET_DATA_ERROR,
  GETTING_DATA
} from "../actions/setDataAction";

const initialState = {
  data: [],
  dataErr: null,
  gettingData: false
};

export default function setDataReducer(state = initialState, action) {
  switch (action.type) {
    case GETTING_DATA:
      return {
        ...state,
        gettingData: true
      };
    case GET_DATA_SUCCESS:
      return {
        ...state,
        gettingData: false,
        data: action.payload
      };
    case GET_DATA_ERROR:
      return {
        ...state,
        gettingData: false,
        dataErr: action.payload
      };
    default:
      return state;
  }
}
