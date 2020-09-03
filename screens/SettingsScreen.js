import React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet
} from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import {firestore, geofirestore, geocollection} from "../components/fb/config";
import * as firebase from "firebase/app";
import * as Permissions from "expo-permissions";
import uuid from "uuid";

export const LOCATION_TASK_NAME = "background-location-task";

export default class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      location: null,
      errorMessage: null,
      devices: []
    };
  }
  componentDidMount() {
    this._getLocationAsync;
  }

  onPress = async () => {
    const {status} = await Location.requestPermissionsAsync();
    if (status === "granted") {
      // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      //   accuracy: Location.Accuracy.BestForNavigation,
      //   timeInterval: 1000,
      //   foregroundService: {
      //     notificationTitle: "Illuminati",
      //     notificationBody: "Requesting location"
      //   }
      // })
      //   .then(res => {
      //     console.log("bg loc response", res);
      //   })
      //   .catch(err => console.log("err", err));

      //    async startLocationUpdates(accuracy = this.state.accuracy) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        showsBackgroundLocationIndicator: true
      })
        .then((res) => {
          console.log("bg loc response", res);
        })
        .catch((err) => console.log("err", err));
    }
  };

  _getLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({location: location, id: uuid()});

    let getNearbyDevicesPromise = new Promise((resolve, reject) => {
      const query = geofirestore.collection("devices2").near({
        center: new firebase.firestore.GeoPoint(
          this.state.location.coords.latitude,
          this.state.location.coords.longitude
        ),
        radius: 1000
      });

      // Get query (as Promise)
      query
        .get()
        .then((value) => {
          // All GeoDocument returned by GeoQuery, like the GeoDocument added above
          // console.log("GET REQ", value.docs[0].data().userName);
          this.setState({devices: value.docs});
          resolve("success");
        })
        .catch((err) => {
          console.log("err", err);
          reject(err);
        });
    });
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <Text>Enable background location</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._getLocationAsync}>
          <Text>get devices</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.devices}
          renderItem={({item}) => (
            <View>
              <Text style={styles.paragraph}>Device ID:{item.id}</Text>
              <Text style={styles.paragraph}>User:{item.data().userName}</Text>
              <Text style={styles.paragraph}>distance:{item.distance}km</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

TaskManager.getTaskOptionsAsync(LOCATION_TASK_NAME).then((res) =>
  console.log("task res", res)
);

SettingsScreen.navigationOptions = {
  title: "app.json"
};

const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  }
});
