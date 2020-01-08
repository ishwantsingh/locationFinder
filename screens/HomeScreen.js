import React, { Component } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import uuid from "uuid";
import * as firebase from "firebase/app";
import "firebase/firestore";

import {
  firestore,
  geofirestore,
  geocollection
} from "../components/fb/config";

export default class HomeScreen extends Component {
  state = {
    location: null,
    errorMessage: null
  };

  UNSAFE_componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location, id: uuid() });

    let myFirstPromise = new Promise((resolve, reject) => {
      const query = geofirestore.collection("devices2").near({
        center: new firebase.firestore.GeoPoint(
          this.state.location.coords.latitude,
          this.state.location.coords.longitude
        ),
        radius: 1000
      });

      // Get query (as Promise)
      query.get().then(value => {
        // All GeoDocument returned by GeoQuery, like the GeoDocument added above
        console.log("WUTTT");
        console.log(value.docs);
      });
    });
    // BELOW THIS WORKS

    // let myFirstPromise = new Promise((resolve, reject) => {
    //   // geofirestore.collection("devices2").add({
    //   //   g: "devices2",
    //   //   l:
    //   //   createdAt: new Date(),
    //   //   location: this.state.location,
    //   //   id: this.state.id
    //   // });
    //   geofirestore.collection("devices2").add({
    //     name: "Geofirestore",
    //     score: 100,
    //     // The coordinates field must be a GeoPoint!
    //     coordinates: new firebase.firestore.GeoPoint(
    //       this.state.location.coords.latitude,
    //       this.state.location.coords.longitude
    //     )
    //   });
    //   console.log("oooooooooooof");
    // })
    //   .then(docRef => {
    //     console.log("Document written with ID: ", docRef);
    //     resolve("Success!");
    //   })
    //   .catch(function(error) {
    //     console.error("Error adding document: ", error);
    //   });

    ////  ABOVE THIS WORKS
    //     .then(() =>
    //       firestore
    //         .collection("devices")
    //         .add({
    //           createdAt: new Date(),
    //           location: this.state.location,
    //           id: this.state.id
    //         })
    //         .then(function(docRef) {
    //           console.log("Document written with ID: ", docRef.id);
    //         })
    //         .catch(function(error) {
    //           console.error("Error adding document: ", error);
    //         })
    //     )
    //     .catch(function(error) {
    //       console.error("Error adding document: ", error);
    //     });
    //   console.log(this.state);
  };

  // _getDocsAsync = async () => {
  //   const query = await geocollection.near({
  //     center: new firebase.firestore.GeoPoint(
  //       (this.state.location.coords.latitude,
  //       this.state.location.coords.longitude)
  //     ),
  //     radius: 1000
  //   });

  //   // Get query (as Promise)
  //   query.get().then(value => {
  //     // All GeoDocument returned by GeoQuery, like the GeoDocument added above
  //     console.log("WUTTT");
  //     console.log(value.docs);
  //   });
  // };

  render() {
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  }
});
