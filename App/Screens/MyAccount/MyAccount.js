import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";

import * as firebase from "firebase";

import MyAccountGuest from "../../Components/MyAccount/MyAccountGuest";
import MyAccountUser from "../../Components/MyAccount/MyAccountUser/";

export default class MyAccount extends Component {
  constructor() {
    super();

    this.state = {
      login: false
    };
  }

  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          login: true
        });
      } else {
        this.setState({
          login: false
        });
      }
    });
  }

  logOut() {
    firebase.auth().signOut();
  }

  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  render() {
    const { login } = this.state;
    if (login) {
      return <MyAccountUser />;
    } else {
      return <MyAccountGuest goToScreen={this.goToScreen} />;
    }
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
