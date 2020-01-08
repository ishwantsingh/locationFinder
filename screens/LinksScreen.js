import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button
} from "react-native";

import { login, logout } from "../state/actions/authAction";
import { connect } from "react-redux";

/* <View style={styles.buttonContainer}>
<Button onPress={props.logout} title="Sign Out" />
</View> */

class LinksScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.isAuthenticated ? (
          <LoggedInPage
            name={this.props.user.name}
            photoUrl={this.props.user.photoUrl}
          />
        ) : (
          <LoginPage login={this.props.login} />
        )}
      </View>
    );
  }
}
LinksScreen.navigationOptions = {
  title: "Links"
};

function mapStateToProps(state) {
  return {
    isLoggingIn: state.authInfo.isLoggingIn,
    loginError: state.authInfo.loginError,
    isAuthenticated: state.authInfo.isAuthenticated,
    user: state.authInfo.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
  };
};

const LoginPage = props => {
  return (
    <View>
      <Text style={styles.header}>Sign In With Google</Text>
      <Button title="Sign in with Google" onPress={() => props.login()} />
    </View>
  );
};

const LoggedInPage = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome:{props.user.name}</Text>
      <Image style={styles.image} source={{ uri: props.user.photoUrl }} />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 25
  },
  image: {
    marginTop: 15,
    width: 150,
    height: 150,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 3,
    borderRadius: 150
  },
  buttonContainer: {
    marginTop: 10
  },
  form: {
    marginTop: 1
  },
  errorText: {
    color: "#f50057",
    marginBottom: 5,
    textAlign: "center"
  }
});
