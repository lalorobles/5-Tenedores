import t from "tcomb-form-native";
import formValidation from "../Utils/Validation";
import inputTemplate from "./templates/Input";

export const RegisterStruct = t.struct({
  name: t.String,
  email: formValidation.email,
  password: formValidation.password,
  passwordConfirmation: formValidation.password
});

export const RegisterOptions = {
  fields: {
    name: {
      template: inputTemplate,
      config: {
        placeholder: "Escribe Nombre y Apellidos",
        iconType: "material-community",
        iconName: "account-outline"
      }
    },
    email: {
      template: inputTemplate,
      config: {
        placeholder: "Escribe tu email",
        iconType: "material-community",
        iconName: "at"
      }
    },
    password: {
      template: inputTemplate,
      config: {
        placeholder: "Escribe tu contraseña",
        password: true,
        secureTextEntry: true,
        iconType: "material-community",
        iconName: "lock-outline"
      }
    },
    passwordConfirmation: {
      password: true,
      secureTextEntry: true,
      template: inputTemplate,
      config: {
        placeholder: "Repite tu contraseña",
        password: true,
        secureTextEntry: true,
        iconType: "material-community",
        iconName: "lock-reset"
      }
    }
  }
};
