import React from "react";
import { Provider } from "react-redux";

import configureStore from "./state/store";
import AppContainer from "./AppContainer";

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
