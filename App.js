import React from "react";
import {Provider} from "react-redux";
import * as TaskManager from "expo-task-manager";
import * as firebase from "firebase/app";
import "firebase/firestore";

import configureStore from "./state/store";
import AppContainer from "./AppContainer";
import {LOCATION_TASK_NAME} from "./screens/SettingsScreen";
import {myFirebase, geofirestore} from "./components/fb/config";

const store = configureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({data, error}) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);
    return;
  }

  if (data) {
    const {locations} = data; //comes in from settingsScreen where location is being updated in bg
    console.log("bg location data", locations[0].coords);

    myFirebase.auth().onAuthStateChanged((userAuth) => {
      var user = userAuth;

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

    // do something with the locations captured in the background
  }
});
