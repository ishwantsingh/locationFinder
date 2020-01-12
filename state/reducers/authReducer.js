import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  // SIGNUP_SUCCESS,
  // SIGNUP_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  AUTH_TOKEN,
  AUTH_CREDS,
  FIREBASE_USERAUTH_SETTING,
  FIREBASE_USERAUTH_SUCCESS,
  FIREBASE_USERAUTH_ERROR
} from "../actions/authAction";

const initialState = {
  authError: null,
  authCompleted: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isVerifying: false,
  loginError: false,
  logoutError: false,
  loginErrorMessage: null,
  isAuthenticated: false,
  user: {},
  // newUser: {},
  accessToken: "",
  idToken: "",
  refreshToken: "",
  firbaseAuthSetting: false,
  firebaseAuthSuccess: false,
  firebaseAuthError: null
  //  signupErr: ""
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        authCompleted: true,
        authError: null,
        user: action.payload.user
      };
    case AUTH_TOKEN:
      return {
        ...state,
        accessToken: action.payload
      };
    case AUTH_CREDS:
      return {
        ...state,
        idToken: action.payload.idToken,
        refreshToken: action.payload.refreshToken
      };
    case AUTH_FAIL:
      return { ...state, authError: action.payload, authCompleted: false };
    // case SIGNUP_SUCCESS:
    //   return {
    //     ...state,
    //     newUser: action.payload
    //   };
    // case SIGNUP_ERROR:
    //   return {
    //     ...state,
    //     signupErr: action.payload
    //   };
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        loginError: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        user: action.user
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true,
        authError: action.payload
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        logoutError: false,
        isAuthenticated: false
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: false,
        isAuthenticated: false,
        authCompleted: false,
        user: {},
        loginErrorMessage: null
        // newUser: {}
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false,
        logoutError: true,
        loginErrorMessage: action.payload
      };
    case VERIFY_REQUEST:
      return {
        ...state,
        isVerifying: true,
        verifyingError: false
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        isVerifying: false
      };
    case FIREBASE_USERAUTH_SETTING:
      return {
        ...state,
        firbaseAuthSetting: true
      };
    case FIREBASE_USERAUTH_SUCCESS:
      return {
        ...state,
        firbaseAuthSetting: false,
        firebaseAuthSuccess: true
      };
    case FIREBASE_USERAUTH_ERROR:
      return {
        ...state,
        firbaseAuthSetting: false,
        firebaseAuthError: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
