import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "./reducers/rootReducer";
import { verifyAuth } from "./actions/authAction";

export default function configureStore(persistedState) {
  const store = createStore(
    rootReducer,
    persistedState,
    compose(
      applyMiddleware(thunkMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
  store.dispatch(verifyAuth());
  return store;
}
