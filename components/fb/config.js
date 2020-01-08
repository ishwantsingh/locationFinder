import * as firebase from "firebase/app";
import "firebase/firestore";

import {
  GeoCollectionReference,
  GeoFirestore,
  GeoQuery,
  GeoQuerySnapshot
} from "geofirestore";

var firebaseConfig = {
  apiKey: "AIzaSyBHQoWETCNTXDnHB74fxgsO7ZBJofTd5Vg",
  authDomain: "postinow.firebaseapp.com",
  databaseURL: "https://postinow.firebaseio.com",
  projectId: "postinow",
  storageBucket: "postinow.appspot.com",
  messagingSenderId: "843786178997",
  appId: "1:843786178997:web:8eafce5a2aec27250609fc"
};

export const myFirebase = firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

// Create a GeoFirestore reference : GeoFirestore
export const geofirestore = new GeoFirestore(firestore);

//Create a GeoCollection reference : GeoCollectionReference
export const geocollection = geofirestore.collection("devices2");

// Create a GeoQuery based on a location : GeoQuery
//const query = geocollection.near({ center: new firebase.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });

// Get query (as Promise) : GeoQuerySnapshot
// query.get().then((value) => {
//   console.log(value.docs); // All docs returned by GeoQuery
// });
