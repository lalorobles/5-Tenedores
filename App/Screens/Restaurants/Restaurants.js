import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";

export default class Restaurants extends Component {
  render() {
    return (
      <View style={styles.viewBody}>
        <Text>Home</Text>
        <ActionButton
          buttonColor="#00a680"
          onPress={() => {
            console.log("Open App Restaurantt");
          }}
        />
      </View>
    );
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
