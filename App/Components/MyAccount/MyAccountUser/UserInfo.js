import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, Button } from "react-native-elements";
import UpdateUserInfo from "./UpadateUserInfo";
import Toast, { DURATION } from "react-native-easy-toast";
import SolucionTimer from "../../../../lib/SolucionTimer.js";
import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
//import { Permissions, ImagePicker } from "expo";

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      userInfo: {}
    };
  }

  componentDidMount = async () => {
    await this.getUserInfo();
  };

  getUserInfo = () => {
    const user = firebase.auth().currentUser;
    user.providerData.forEach(userInfo => {
      this.setState({
        userInfo
      });
    });
  };

  reauthenticate = currentPassword => {
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(credentials);
  };

  checkUserAvatar = photoUrl => {
    console.log("URL DE LA FOTO", photoUrl);

    return photoUrl
      ? photoUrl
      : // : "https://scontent.fcen1-1.fna.fbcdn.net/v/t1.0-1/c0.9.960.960a/p960x960/53824265_2205938106130159_6152113413943197696_o.jpg?_nc_cat=105&_nc_oc=AQmOupME_wlAnOMI52ex1sbjKNqkj28HxJPrlzMfgMWyKOppQYvnspS0fVz_E1UpWxE&_nc_ht=scontent.fcen1-1.fna&oh=661d577919c2adc2e698d3623d0d46d9&oe=5DD8C31A";
        "https://api.adorable.io/avatars/285/abott@adorable.png";
  };

  updateUserDisplayName = async newDisplayName => {
    const update = {
      displayName: newDisplayName
    };
    await firebase.auth().currentUser.updateProfile(update);
    this.getUserInfo();
    this.refs.toastAlert.show(
      "Nombre y Apellidos cambiados correctamente",
      1500
    );
  };

  updateUserEmail = async (newEmail, password) => {
    this.reauthenticate(password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            this.refs.toastAlert.show(
              "Email actualizado correctamente, vuelve a iniciar sesión",
              100,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(err => {
            this.refs.toastAlert.show(err, 1500);
          });
      })
      .catch(err => {
        this.refs.toastAlert.show("Contraseña incorrecta", 1500);
      });
  };

  updateUserPassword = async (currentPassword, newPassword) => {
    this.reauthenticate(currentPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            this.refs.toastAlert.show(
              "Contraseña cambiada correctamente, vuelve a iniciar sesión",
              100,
              () => {
                firebase.auth().signOut();
              }
            );
          })
          .catch(err => {
            this.refs.toastAlert.show(err, 1500);
          });
      })
      .catch(err => {
        this.refs.toastAlert.show(
          "La contraseña actual ingresada es incorrecta",
          1500
        );
      });
  };

  returnUpdateUserInfoComponent = userInfoData => {
    if (userInfoData.hasOwnProperty("uid")) {
      return (
        <UpdateUserInfo
          userInfo={this.state.userInfo}
          updateUserDisplayName={this.updateUserDisplayName}
          updateUserEmail={this.updateUserEmail}
          updateUserPassword={this.updateUserPassword}
        />
      );
    }
  };

  updateUserPhotoURL = async photouri => {
    const update = {
      photoURL: photouri
    };
    await firebase.auth().currentUser.updateProfile(update);
    this.getUserInfo();
    this.refs.toastAlert.show("Imagen actualizada correctamente", 1500);
  };

  changeAvatarUser = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (resultPermission.status === "denied") {
      this.refs.toastAlert.show(
        "Es necesario aceptar los permisos de la galeria",
        1000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        this.refs.toastAlert.show("Has cerrado la galeria de imagenes", 1500);
      } else {
        const { uid } = this.state.userInfo;
        this.uploadImage(result.uri, uid)
          .then(resolve => {
            this.refs.toastAlert.show("Imagen actualizada correctamente", 1500);

            firebase
              .storage()
              .ref("avatar/" + uid)
              .getDownloadURL()
              .then(resolve => {
                console.log(resolve);
                this.updateUserPhotoURL(resolve);
              })
              .catch(error => {
                this.refs.toastAlert.show(
                  "Error al recuperar la imagen del servidor",
                  1500
                );
              });
          })
          .catch(error => {
            this.refs.toastAlert.show(
              "Error al subir la imagen, intentelo más tarde",
              1500
            );
          });
      }
    }
  };

  uploadImage = async (uri, nameImage) => {
    // await fetch(uri)
    //   .then(async resul => {
    //     elStorage = firebase
    //       .storage()
    //       .ref()
    //       .child("avatars/" + nameImage);
    //     await elStorage.put(resul._bodyBlob);
    //     console.log("Si entramos");

    //     this.refs.toastAlert.show("Imagen subida!", 1500);
    //   })
    //   .catch(error => {
    //     this.refs.toastAlert.show(
    //       "Ocurrio un error, inténtalo nuevamente.",
    //       1500
    //     );
    // });
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    })
      .then(async resolve => {
        let ref = firebase
          .storage()
          .ref()
          .child("avatar/" + nameImage);
        return await ref.put(resolve);
      })
      .catch(error => {
        this.refs.toastAlert.show(
          "Error al subir la imagen al servidor, intentelo más tarde",
          1500
        );
      });
  };

  render() {
    const { displayName, email, photoURL } = this.state.userInfo;
    return (
      <View>
        <View style={styles.viewUserInfo}>
          <Avatar
            rounded
            size="large"
            showEditButton
            onEditPress={() => this.changeAvatarUser()}
            source={{
              uri: this.checkUserAvatar(photoURL)
            }}
            containerStyle={styles.userInfoAvatar}
          />
          <View>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text>{email}</Text>
          </View>
        </View>
        {this.returnUpdateUserInfoComponent(this.state.userInfo)}
        <Button
          title="Cerrar Sesión"
          onPress={() => firebase.auth().signOut()}
          buttonStyle={styles.btnCloseSesion}
          titleStyle={styles.btnCloseSesionText}
        />
        <Toast
          ref="toastAlert"
          position="bottom"
          positionValue={250}
          fadeInduration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "#f2f2f2"
  },
  userInfoAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  },
  btnCloseSesion: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10
  },
  btnCloseSesionText: {
    color: "#00a680"
  }
});
