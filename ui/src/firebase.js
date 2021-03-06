/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-heAkqXWT22uWI-AGDtdCEC-4NY4eSJQ",
  authDomain: "kyle-strava-routes.firebaseapp.com",
  projectId: "kyle-strava-routes",
  storageBucket: "kyle-strava-routes.appspot.com",
  messagingSenderId: "484431681071",
  appId: "1:484431681071:web:f8f6ccd8e405432f7698da",
  measurementId: "G-K6DQWWFZWB",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
