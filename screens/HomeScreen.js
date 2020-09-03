import React, {Component} from "react";
import {Platform, Text, View, StyleSheet, Button} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import uuid from "uuid";
import * as firebase from "firebase/app";
import "firebase/firestore";
import {connect} from "react-redux";

import {setLoc} from "../state/actions/newMessageAction";

export const LOCATION_TASK_NAME = "background-location-task";

import {geofirestore} from "../components/fb/config";

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      location: null,
      errorMessage: null,
      devices: []
    };
  }

  _setLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      location: location,
      id: uuid(),
      errorMessage: null,
      uid: this.props.uid
    });

    let setCurrentLocationPromise = new Promise((resolve, reject) => {
      console.log("name,id", this.props.name, this.props.uid);
      geofirestore
        .collection("devices2")
        .doc(`${this.props.uid}`)
        .set({
          userName: this.props.name, // add any data here instead of name and score. that is dummy data
          uid: this.props.uid, // replace by actual data
          // The coordinates field must be a GeoPoint!
          coordinates: new firebase.firestore.GeoPoint(
            this.state.location.coords.latitude,
            this.state.location.coords.longitude
          )
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef);
          resolve(docRef);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          reject(error);
        });
    });
    setCurrentLocationPromise
      .then((res) => console.log("Res", res))
      .catch(function (error) {
        console.error("error", error);
      });
  };

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
      </View>
    );
  }
}

function mapStateToProps(state) {
  if (
    state.authInfo.user !== null &&
    state.authInfo.user.providerData !== undefined // &&
    //  state.setLocReducer.loc !== {}
  ) {
    // console.log(state.authInfo.user);
    return {
      isAuthenticated: state.authInfo.isAuthenticated,
      uid: state.authInfo.user.providerData[0].uid,
      name: state.authInfo.user.providerData[0].displayName,
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
    return {coords: null};
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
