import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from "./src/containers/Login";
import MainChat from "./src/containers/MainChat";

const AppNavigator = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    MainChat: {
      screen: MainChat
    }
  },
  {
    initialRouteName: 'Login',
  }
);
export default createAppContainer(AppNavigator);
