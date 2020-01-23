import React, { Component } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as TaskManager from "expo-task-manager";
import uuid from "uuid";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { connect } from "react-redux";

//import { locationData } from "../App";
import { setLoc } from "../state/actions/newMessageAction";

export const LOCATION_TASK_NAME = "background-location-task";

import {
  firestore,
  geofirestore,
  geocollection
} from "../components/fb/config";

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      location: null,
      errorMessage: null
    };
    //   this.onPress();
  }

  // background location function
  // onPress = async () => {
  //   const { status } = await Location.requestPermissionsAsync();
  //   if (status === "granted") {
  //     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //       accuracy: Location.Accuracy.Balanced,
  //       showsBackgroundLocationIndicator: true
  //     })
  //       .then(res => {
  //         console.log("imported locationData", locationData);
  //         this.setState({ location: res });
  //         if (this.props.coords !== null) {
  //           let setCurrentLocationPromise = new Promise((resolve, reject) => {
  //             geofirestore
  //               .collection("devices2")
  //               .doc(this.props.uid)
  //               .add({
  //                 name: this.props.name, // add any data here instead of name and score. that is dummy data
  //                 score: 100, // replace by actual data
  //                 // The coordinates field must be a GeoPoint!
  //                 coordinates: new firebase.firestore.GeoPoint(
  //                   this.props.coords.latitude,
  //                   this.props.coords.longitude
  //                 )
  //               })
  //               .then(docRef => {
  //                 console.log("Document written with ID: ", docRef);
  //                 resolve(docRef);
  //               })
  //               .catch(function(error) {
  //                 console.error("Error adding document: ", error);
  //                 reject(error);
  //               });
  //             console.log("oooooooooooof");
  //           });
  //           setCurrentLocationPromise
  //             .then(res => console.log("Res", res))
  //             .catch(function(error) {
  //               console.error("error", error);
  //             });
  //         }
  //       })
  //       .catch(err => console.log("err", err));
  //   }
  // };

  // UNSAFE_componentWillReceiveProps() {
  //   if (locationData !== {}) {
  //     this.props.setLoc(locationData);
  //   }
  // }

  // setUid = () => {
  // };

  // componentWillUpdate() {
  //   if (this.props.uid !== null) {
  //     uid = this.props.uid;
  //   }
  // }

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

    let getNearbyDevicesPromise = new Promise((resolve, reject) => {
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
        console.log(value.docs);
      });
    });
  };
  // BELOW THIS WORKS

  // geofirestore.collection("devices2").add({
  //   g: "devices2",
  //   l:
  //   createdAt: new Date(),
  //   location: this.state.location,
  //   id: this.state.id
  // });
  //   geofirestore.collection("devices2").add({
  //     name: "Geofirestore", // add any data here instead of name and score. that is dummy data
  //     score: 100,            // replace by actual data
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

  _setLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location, id: uuid() });

    let setCurrentLocationPromise = new Promise((resolve, reject) => {
      geofirestore
        .collection("devices2")
        .add({
          name: "Geofirestore", // add any data here instead of name and score. that is dummy data
          score: 100, // replace by actual data
          // The coordinates field must be a GeoPoint!
          coordinates: new firebase.firestore.GeoPoint(
            this.state.location.coords.latitude,
            this.state.location.coords.longitude
          )
        })
        .then(docRef => {
          console.log("Document written with ID: ", docRef);
          resolve(docRef);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          reject(error);
        });
    });
    setCurrentLocationPromise
      .then(res => console.log("Res", res))
      .catch(function(error) {
        console.error("error", error);
      });
  };

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
        <Button title="set location" onPress={() => this._setLocationAsync()} />
        {/* <Button title="set uid" onPress={() => this.setUid()} /> */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  // console.log("STATE LOC IS", state.setLocReducer.loc);
  if (
    state.authInfo.user !== null &&
    state.authInfo.user.providerData !== undefined // &&
    //  state.setLocReducer.loc !== {}
  ) {
    return {
      isAuthenticated: state.authInfo.isAuthenticated,
      uid: state.authInfo.user.providerData[0].uid,
      name: state.authInfo.user.providerData[0].name,
      accessToken: state.authInfo.accessToken.token
      //     coords: state.setLocReducer.loc[0].coords
    };
  } else if (state.authInfo.user === null || undefined)
    return {
      isAuthenticated: state.authInfo.isAuthenticated,
      uid: null,
      name: "",
      accessToken: state.authInfo.accessToken.token
      //  coords: null
    };
  else {
    return { coords: null };
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     setLoc: loc => dispatch(setLoc(loc))
//   };
// };

HomeScreen.navigationOptions = {
  header: null
};

export let uid;

export default connect(mapStateToProps, {})(HomeScreen);

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
