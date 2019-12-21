/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { GiftedChat } from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';
import {REACT_APP_PUBNUB_PUBLISH_KEY, REACT_APP_PUBNUB_SUBSCRIBE_KEY} from '../../envs.js';

const RoomName = "MainChat1";


export default class MainChat extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({ publishKey: REACT_APP_PUBNUB_PUBLISH_KEY, subscribeKey: REACT_APP_PUBNUB_SUBSCRIBE_KEY,
      uuid: this.props.navigation.getParam("username"),
      presenceTimeout: 10 });
    this.pubnub.init(this);
    this.id = this.randomid();
    this.state = {
      isTyping: false,
      messages: [],
      onlineUsers: [],
      onlineUsersCount: 0

    };

    const navigationOptions = ({ navigation }) => {
      return {
        headerTitle:
          navigation.getParam("onlineUsersCount", "No") + " member online",
        headerLeft: null,
        headerRight: (
          <Button
            onPress={() => {
              navigation.state.params.leaveChat();
            }}
            title="Logout"
            color="red"
          />
        )
      };
  };
};


  componentWillMount() {
    this.props.navigation.setParams({
      onlineUsersCount: this.state.onlineUsersCount,
      leaveChat: this.leaveChat.bind(this)
    });
    this.pubnub.subscribe({
      channels: [RoomName],
      withPresence: true
    });
    this.pubnub.getMessage(RoomName, m => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, m["message"])
      }));
    });
    // this.hereNow();
    this.PresenceStatus();
  }

  componentDidMount() {
    this.pubnub.history(
      { channel: "MainChat", reverse: true, count: 15 },
      (status, res) => {
        let newmessage = [];
        res.messages.forEach(function(element, index) {
          newmessage[index] = element.entry[0];
        });
        console.log(newmessage);
        this.setState(previousState => ({
          messages: GiftedChat.append(
            previousState.messages,
            newmessage.reverse()
          )
        }));
      }
    );
  }

  componentWillUnmount() {
    this.leaveChat();
  }

  onSend(messages = []) {
    this.pubnub.publish({
      message: messages,
      channel: "channel1",
    });
    this.pubnub.getMessage("channel1", m => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, m["message"]),
      }));
    });
  }

  leaveChat = () => {
    this.pubnub.unsubscribe({ channels: [RoomName] });
    return this.props.navigation.navigate("Login");
  };

  randomid = () => {
    return Math.floor(Math.random() * 100);
  };

  PresenceStatus = () => {
    this.pubnub.getPresence(RoomName, presence => {
      if (presence.action === "join") {
        let users = this.state.onlineUsers;
        users.push({
          state: presence.state,
          uuid: presence.uuid
        });
        this.setState({
          onlineUsers: users,
          onlineUsersCount: this.state.onlineUsersCount + 1
        });
        this.props.navigation.setParams({
          onlineUsersCount: this.state.onlineUsersCount
        });
      }
      if (presence.action === "leave" || presence.action === "timeout") {
        let leftUsers = this.state.onlineUsers.filter(
          users => users.uuid !== presence.uuid
        );
        this.setState({
          onlineUsers: leftUsers
        });
        const length = this.state.onlineUsers.length;
        this.setState({
          onlineUsersCount: length
        });
        this.props.navigation.setParams({
          onlineUsersCount: this.state.onlineUsersCount
        });
      }
      if (presence.action === "interval") {
        if (presence.join || presence.leave || presence.timeout) {
          let onlineUsers = this.state.onlineUsers;
          let onlineUsersCount = this.state.onlineUsersCount;
          if (presence.join) {
            presence.join.map(
              user =>
                user !== this.uuid &&
                onlineUsers.push({
                  state: presence.state,
                  uuid: user
                })
            );
            onlineUsersCount += presence.join.length;
          }
          if (presence.leave) {
            presence.leave.map(leftUser =>
              onlineUsers.splice(onlineUsers.indexOf(leftUser), 1)
            );
            onlineUsersCount -= presence.leave.length;
          }
          if (presence.timeout) {
            presence.timeout.map(timeoutUser =>
              onlineUsers.splice(onlineUsers.indexOf(timeoutUser), 1)
            );
            onlineUsersCount -= presence.timeout.length;
          }
          this.setState({
            onlineUsers,
            onlineUsersCount
          });
          this.props.navigation.setParams({
            onlineUsersCount: this.state.onlineUsersCount
          });
        }
      }
    });
  };

  render() {
     let username = this.props.navigation.getParam("username");
     return (
       <View style={{ flex: 1 }}>
         <View style={styles.online_user_wrapper}>
           {this.state.onlineUsers.map((item, index) => {
             return (
               <View key={item.uuid}>
                 <Image
                   key={item.uuid}
                   style={styles.online_user_avatar}
                   source={{
                     uri: "https://robohash.org/" + item.uuid
                   }}
                 />
               </View>
             );
           })}
         </View>
         <GiftedChat
           messages={this.state.messages}
           onSend={messages => this.onSend(messages)}
           user={{
             _id: username,
             name: username,
             avatar: "https://robohash.org/" + username
           }}
         />
       </View>
     );
   }
 };

const styles = StyleSheet.create({
  online_user_avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    margin: 10
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  online_user_wrapper: {
    height: "8%",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "grey",
    flexWrap: "wrap"
  }
});
