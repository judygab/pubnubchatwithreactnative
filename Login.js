import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
export default class Login extends Component {
  state = { username: "", password: "" };
  login() {
  if (
    (user[0].username == this.state.username &&
      user[0].password == this.state.password) ||
    (user[1].username == this.state.username &&
      user[1].password == this.state.password)
  ) {
    this.props.navigation.navigate("MainChat", {
      username: this.state.username
    });
  } else {
    console.log(this.state);
    alert("username or password is incorrect");
  }
}
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            source={require("../img/react.jpg")}
            style={{ width: 66, height: 58 }}
          />
          <Image
            source={require("../img/pubnublogo.png")}
            style={{ width: 60, height: 60 }}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.welcome}>Chat with Pubnub</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={username => this.setState({ username })}
            />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            />
          <View style={styles.btnContiner}>
            <TouchableOpacity style={styles.btn} >
              <Text style={styles.btntext}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 66
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    margin: 10,
    fontWeight: "300"
  },
  input: {
    width: "90%",
    backgroundColor: "skyblue",
    padding: 15,
    marginBottom: 10
  },
  btnContiner: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%"
  },
  btn: {
    backgroundColor: "orange",
    padding: 15,
    width: "45%"
  },
  btntext: { fontSize: 16, textAlign: "center" },
  logo: {
    flexDirection: "row"
  }
});
