import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

var firebaseConfig = {
  apiKey: "AIzaSyCmkB2uuDg2Y6INOndGf1vAbIIymd-eBpQ",
  authDomain: "pink-games.firebaseapp.com",
  databaseURL: "https://pink-games.firebaseio.com",
  projectId: "pink-games",
  storageBucket: "pink-games.appspot.com",
  messagingSenderId: "594669072234",
  appId: "1:594669072234:web:35357aff76063bc3f5bf13",
  measurementId: "G-1LX051M2DL",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById("app"));
