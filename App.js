import React from "react";
import { Provider } from "react-redux";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { connect } from "react-redux";

import configureStore from "./state/store";
import AppContainer from "./AppContainer";
import { LOCATION_TASK_NAME } from "./screens/SettingsScreen";
import { setLoc } from "./state/actions/newMessageAction";
const store = configureStore();

export default class App extends React.Component {
  // componentWillReceiveProps() {
  //   if (locationData !== {}) {
  //     this.props.setLoc(locationData);
  //   }
  // }

  render() {
    console.log("store", store.dispatch);
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

// function mapStateToProps(state) {
//   console.log("user is+>", state.authInfo.user);
//   return {

//   };
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     setLoc: loc => dispatch(setLoc(loc))
//   };
// };
export let locationData = {};

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("bg location data", locations[0].coords);
    locationData = locations;

    // do something with the locations captured in the background
  }
});

//export default connect({}, mapDispatchToProps)(App);
