import React from "react";
import { Text, TouchableOpacity } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

export const LOCATION_TASK_NAME = "background-location-task";

export default class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.onPress();
  }

  onPress = async () => {
    const { status } = await Location.requestPermissionsAsync();
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
        //  timeInterval: 6000,
        //  distanceInterval: 0
      })
        .then(res => {
          console.log("bg loc response", res);
        })
        .catch(err => console.log("err", err));

      // await Location.watchPositionAsync(
      //   {
      //     accuracy: Location.Accuracy.Highest,
      //     timeInterval: 100
      //   },
      //   function(res) {
      //     console.log("current loc updates", res);
      //   }
      // );
    }
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <Text>Enable background location</Text>
      </TouchableOpacity>
    );
  }
}

TaskManager.getTaskOptionsAsync(LOCATION_TASK_NAME).then(res =>
  console.log("task res", res)
);

SettingsScreen.navigationOptions = {
  title: "app.json"
};
