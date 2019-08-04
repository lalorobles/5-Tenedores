import React from "react";
import { StyleSheet, Text, View } from "react-native";
import UserNavigation from "./App/Navigations/User";

//INICIAS FIREBASE
import fireBaseConfig from "./App/Utils/FireBase";
import * as firebase from "firebase";
firebase.initializeApp(fireBaseConfig);

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <UserNavigation />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
