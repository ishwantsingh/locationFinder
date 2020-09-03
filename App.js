import React from "react";
import {Provider} from "react-redux";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as firebase from "firebase/app";
import "firebase/firestore";

import configureStore from "./state/store";
import AppContainer from "./AppContainer";
import {LOCATION_TASK_NAME} from "./screens/SettingsScreen";
import {
  myFirebase,
  firestore,
  geofirestore,
  geocollection
} from "./components/fb/config";
import {uid} from "./screens/HomeScreen";
import {UidContext} from "./screens/LinksScreen";

const store = configureStore();

var uid_value = "2";

export default class App extends React.Component {
  // static contextType = UidContext;

  // uid_value = this.context;

  /* perform a side-effect at mount using the value of MyContext */

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
App.contextType = UidContext;
//export let locationData = {};

TaskManager.defineTask(LOCATION_TASK_NAME, ({data, error}) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);
    return;
  }

  if (data) {
    const {locations} = data;
    console.log("bg location data", locations[0].coords);
    console.log("uid", uid_value);
    //  locationData = locations;
    // var user = firebase.auth().currentUser;
    myFirebase.auth().onAuthStateChanged((userAuth) => {
      var user = userAuth;

      console.log("user", user);

      // let setCurrentLocationPromise = new Promise((resolve, reject) => {
      geofirestore
        .collection("devices2")
        .doc(`${user.providerData[0].uid}`)
        .set({
          userName: user.providerData[0].displayName, // add any data here instead of name and score. that is dummy data
          uid: user.providerData[0].uid, // replace by actual data
          // The coordinates field must be a GeoPoint!
          coordinates: new firebase.firestore.GeoPoint(
            locations[0].coords.latitude,
            locations[0].coords.longitude
          )
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef);
          //  resolve(docRef);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          //  reject(error);
        });
    });
    console.log("oooooooooooof");
    // });
    // setCurrentLocationPromise
    //   .then(res => console.log("Res", res))
    //   .catch(function(error) {
    //     console.error("error", error);
    //   });

    // do something with the locations captured in the background
  }
});
