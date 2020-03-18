import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCPBwcpGEWH9Rkkzqad2o5awZlOs6xQEBY",
  authDomain: "amazing-project-2d55c.firebaseapp.com",
  databaseURL: "https://amazing-project-2d55c.firebaseio.com",
  projectId: "amazing-project-2d55c",
  storageBucket: "amazing-project-2d55c.appspot.com",
  messagingSenderId: "237748113772",
  appId: "1:237748113772:web:5f82dd110145c9cd256349"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
