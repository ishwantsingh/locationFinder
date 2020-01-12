import { myFirebase, firestore } from "../../components/fb/config";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";
import { AsyncStorage, Alert } from "react-native";

import { setUser } from "./setUserAction";

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

export const FIREBASE_USERAUTH_SETTING = "FIREBASE_USERAUTH_SETTING";
export const FIREBASE_USERAUTH_SUCCESS = "FIREBASE_USERAUTH_SUCCESS";
export const FIREBASE_USERAUTH_ERROR = "FIREBASE_USERAUTH_ERROR";

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

const loginError = error => {
  return {
    type: LOGIN_FAILURE,
    payload: { error }
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

const logoutError = error => {
  return {
    type: LOGOUT_FAILURE,
    payload: { error }
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

// const authSuccess = user => {
//   return {
//     type: AUTH_SUCCESS,
//     payload: { user }
//   };
// };

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

// const authFail = error => {
//   return {
//     type: AUTH_FAIL,
//     payload: { error }
//   };
// };

const firebaseUserAuthSetting = () => {
  return {
    type: FIREBASE_USERAUTH_SETTING
  };
};

const firebaseUserAuthSuccess = () => {
  return {
    type: FIREBASE_USERAUTH_SUCCESS
  };
};

const firebaseUserAuthError = error => {
  return {
    type: FIREBASE_USERAUTH_ERROR,
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
          "843786178997-rerdkeff8ifvdmfdh6u81nlcpifkukra.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]
      });
      resolve(result);
      reject("some error occured");
    });
    signInPromise
      .then(result => {
        console.log("sign in result => ", result);
        dispatch(accessToken(result.accessToken));
        () => {
          setToLocalStorage(result.accessToken);
        };
        AsyncStorage.setItem("accessToken", JSON.stringify(result.accessToken));
        dispatch(authCredentials(result.idToken, result.refreshToken));
        //     dispatch(authSuccess(result.user));
        //   dispatch(receiveLogin(result.user));
        dispatch(receiveLogin(result.user));
        dispatch(onSignIn(result));
        dispatch(firebaseUserAuthSetting());
        dispatch(setUser(result.user));
        console.log("dataRecieved", result);
      })
      .catch(error => {
        console.log("error", error);
        //    dispatch(authFail(error));
        dispatch(loginError(error));
      });
  };
}

isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.idToken //getBasicProfile().getId()
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
};

onSignIn = googleUser => {
  console.log("Google Auth Response", googleUser);
  return dispatch => {
    let unsubscribePromise = new Promise((resolve, reject) => {
      var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.

          firebase
            .auth()
            .signInWithCredential(credential)
            .then(res => {
              console.log("fireebase setup response user", res.user);
              dispatch(firebaseUserAuthSuccess());
              dispatch(receiveLogin(res.user));
              // dispatch(accessToken(res.credential.accessToken));
              // dispatch(
              //   authCredentials(res.credential.idToken, res.user.refreshToken)
              // );
              resolve(res);
              dispatch(verifyAuth());
            })
            .catch(error => {
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              dispatch(firebaseUserAuthError(error));
              reject("some error occured");
            });
        } else {
          console.log("User already signed-in Firebase.");
          resolve("User already signed-in Firebase.");
          reject("some error occured");
        }
      });
    });
    // unsubscribePromise.then((res) =>
    // )
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  };
};

export const logout = accessToken => dispatch => {
  console.log("logout accessToken parameter => ", accessToken);
  dispatch(requestLogout());
  dispatch(signOut(accessToken));
};

function signOut(accessToken) {
  return dispatch => {
    let signOutPromise = new Promise((resolve, reject) => {
      const result = Google.logOutAsync({
        accessToken,
        androidClientId:
          "843786178997-rerdkeff8ifvdmfdh6u81nlcpifkukra.apps.googleusercontent.com",
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
        dispatch(logoutError(error));
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

const getFromLocalStorage = async () => {
  const value = await AsyncStorage.getItem("accessToken");
  let accessToken = JSON.parse(value);
  if (accessToken !== null) {
    return accessToken;
  } else if (accessToken == null) {
    return "";
  }
};

const setToLocalStorage = async accessToken => {
  try {
    await AsyncStorage.setItem("accessToken", JSON.stringify(accessToken));
  } catch (error) {
    Alert.alert("Error occured", `${error}`, [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]);
  }
};

export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  myFirebase.auth().onAuthStateChanged(user => {
    if (user !== null) {
      console.log("vrify auth change user ", user);
      getFromLocalStorage().then(function(res) {
        let recievedData = res;
        console.log("vrify auth change ACCESS TOKEN ", res);
        dispatch(accessToken(recievedData));
        return recievedData;
      }); //.then(recievedData => dispatch(accessToken(recievedData)));
      //  dispatch(setData(user.uid, user.uid));
      dispatch(receiveLogin(user));
      //    dispatch(accessToken(user.stsTokenManager.accessToken));
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
