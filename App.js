import React from "react";
import { Provider } from "react-redux";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import configureStore from "./state/store";
import AppContainer from "./AppContainer";
import { LOCATION_TASK_NAME } from "./screens/SettingsScreen";
const store = configureStore();

export default class App extends React.Component {
  render() {
    console.log("boo");
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("bg location data", locations);
    // do something with the locations captured in the background
  }
});
