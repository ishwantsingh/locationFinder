import { myFirebase, firestore } from "../../components/fb/config";
import { setData } from "./setDataAction";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";

export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";

// export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
// export const SIGNUP_ERROR = "SIGNUP_ERROR";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

export const AUTH_TOKEN = "AUTH_TOKEN";
export const AUTH_CREDS = "AUTH_CREDS";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const receiveLogin = user => {
  return {
    type: LOGIN_SUCCESS,
    user
  };
};

const loginError = () => {
  return {
    type: LOGIN_FAILURE
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST
  };
};

const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

const logoutError = () => {
  return {
    type: LOGOUT_FAILURE
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST
  };
};

const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS
  };
};

const authSuccess = user => {
  return {
    type: AUTH_SUCCESS,
    payload: { user }
  };
};

const accessToken = token => {
  return {
    type: AUTH_TOKEN,
    payload: { token }
  };
};

const authCredentials = (idToken, refreshToken) => {
  return {
    type: AUTH_CREDS,
    payload: { idToken, refreshToken }
  };
};

const authFail = error => {
  return {
    type: AUTH_FAIL,
    payload: { error }
  };
};

// const signupSuccess = user => {
//   return {
//     type: SIGNUP_SUCCESS,
//     payload: { user }
//   };
// };
// const signupError = error => {
//   return {
//     type: SIGNUP_ERROR,
//     payload: { error }
//   };
// };

// export const login = (email, password) => dispatch => {
//   dispatch(requestLogin());
//   myFirebase
//     .auth()
//     .signInWithEmailAndPassword(email, password)
//     .then(user => {
//       dispatch(authSuccess(user));
//       dispatch(receiveLogin(user));
//     })
//     .then(user => {
//       console.log("lub lub");
//       dispatch(setData(user.uid, user.uid)); //sender and reciever id same for this app
//       console.log("hub hub hub");
//     })
//     .catch(error => {
//       //Do something with the error if you want!
//       console.log("error", error);
//       dispatch(authFail(error));
//       dispatch(loginError());
//     });
// };

export const login = () => dispatch => {
  dispatch(requestLogin());
  dispatch(signIn());
};

function signIn() {
  return dispatch => {
    let signInPromise = new Promise((resolve, reject) => {
      const result = Google.logInAsync({
        androidClientId:
          "273563789709-k2705a26h2o5io0pa7oifbplg4gg98gl.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]
      });
      resolve(result);
      reject("some error occured");
    });
    signInPromise
      .then(result => {
        dispatch(accessToken(result.accessToken));
        dispatch(authCredentials(result.idToken, result.refreshToken));
        dispatch(authSuccess(result.user));
        dispatch(receiveLogin(result.user));
        dispatch(setUser(result.user));
        console.log("dataRecieved", result);
      })
      .catch(error => {
        console.log("error", error);
        dispatch(authFail(error));
        dispatch(loginError());
      });
  };
}

export const setUser = user => {
  return dispatch => {
    firestore
      .collection("users")
      .doc(user.id)
      .set({
        email: user.email,
        firstName: user.givenName,
        lastName: user.familyName,
        initials: user.givenName[0] + user.familyName[0],
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl
      })
      .then(resp => {
        console.log("SET_USER_SUCCESS", resp);
        //    dispatch(setUserSuccess(resp));
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        //    dispatch(setUserError(errorMessage));
        console.log("SET_USER_ERROR", errorMessage);
      });
  };
};

export const logout = accessToken => dispatch => {
  dispatch(requestLogout());
  dispatch(signOut(accessToken));
};

function signOut(accessToken) {
  return dispatch => {
    let signOutPromise = new Promise((resolve, reject) => {
      const result = Google.logOutAsync({
        accessToken,
        androidClientId:
          "273563789709-k2705a26h2o5io0pa7oifbplg4gg98gl.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]
      });
      resolve(result);
      reject("some error occured");
    });
    signOutPromise
      .then(result => {
        dispatch(receiveLogout());
        console.log("signout success", result);
      })
      .catch(error => {
        console.log("sign out error", error);
        dispatch(logoutError());
      });
  };
}

// export const logout = () => dispatch => {
//   myFirebase
//     .auth()
//     .signOut()
//     .then(function() {
//       console.log("signout success");
//       dispatch(receiveLogout());
//     })
//     .catch(function(error) {
//       // An error happened.
//       console.log("signout error", error);
//       dispatch(logoutError());
//     });
// };

export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  myFirebase.auth().onAuthStateChanged(user => {
    if (user !== null) {
      console.log("auth change user", user);
      dispatch(setData(user.uid, user.uid));
      dispatch(receiveLogin(user));
    }
    console.log("okie dokie");
    dispatch(verifySuccess());
  });
};

// export const signup = (email, password, firstName, lastName) => dispatch => {
//   myFirebase
//     .auth()
//     .createUserWithEmailAndPassword(email, password)
//     .then(resp => {
//       console.log("SIGNUP_SUCCESS", resp);
//       dispatch(signupSuccess(resp));
//       return db
//         .collection("users")
//         .doc(resp.user.uid)
//         .set({
//           firstName: firstName,
//           lastName: lastName,
//           initials: firstName[0] + lastName[0]
//         });
//     })
//     .catch(function(error) {
//       // Handle Errors here.

//       var errorCode = error.code;
//       var errorMessage = error.message;
//       dispatch(signupError(errorMessage));

//       console.log("SIGNUP_ERROR", errorMessage);
//       // ...
//     });
// };
