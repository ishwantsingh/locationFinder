import React from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { login, logout } from "../state/actions/authAction";
import { connect } from "react-redux";

class LinksScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.isAuthenticated ? (
          <LoggedInPage
            name={this.props.name}
            photoUrl={this.props.profilePic}
            accessToken={this.props.accessToken}
            logout={this.props.logout}
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
  console.log("user is+>", state.authInfo.user);
  if (state.authInfo.user.providerData !== undefined) {
    return {
      isLoggingIn: state.authInfo.isLoggingIn,
      loginError: state.authInfo.loginError,
      isAuthenticated: state.authInfo.isAuthenticated,
      name: state.authInfo.user.providerData[0].displayName,
      profilePic: state.authInfo.user.providerData[0].photoURL,
      accessToken: state.authInfo.accessToken.token
    };
  }
  return {
    isLoggingIn: state.authInfo.isLoggingIn,
    loginError: state.authInfo.loginError,
    isAuthenticated: state.authInfo.isAuthenticated,
    name: "",
    profilePic: "",
    accessToken: state.authInfo.accessToken.token
  };
}

const mapDispatchToProps = dispatch => {
  return {
    login: () => dispatch(login()),
    logout: accessToken => dispatch(logout(accessToken))
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
      <Text style={styles.header}>Welcome:{props.name}</Text>
      <Image style={styles.image} source={{ uri: props.photoUrl }} />
      <Button
        onPress={() => props.logout(props.accessToken)}
        title="Sign Out"
      />
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
