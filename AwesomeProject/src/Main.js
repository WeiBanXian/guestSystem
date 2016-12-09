/**
 * 韦浩东
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableHighlight,
    TextInput,
    View,
    AsyncStorage,
    ScrollView,
    Dimensions,
    Alert,
    TouchableOpacity
} from 'react-native';

import Home from './Home.js';
import Setting from './Setting.js';
import Server from './server.js'

const ratio = Dimensions.get('window').width / 1024;

export class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            goBtnOpacity: 1,
            visitor: '',
            clickNum: 0
        };
    }

    componentWillMount() {
        var _self = this;
        AsyncStorage.multiGet(["historyList", "domain"], function (error, result) {
            if (result.length > 0) {
                Server.setDomain(result[1][1]);
            }
        });
    }

    onGoToSetting() {
        var _self = this;
        clearTimeout(this.timer)
        if (this.state.clickNum == 4) {
            this.setState({
                clickNum: 0
            }, function () {
                _self.props.navigator.push({
                    component: Setting
                })
            })
        } else {
            var clickNum = this.state.clickNum + 1;
            this.setState({
                clickNum: clickNum
            })
            this.timer = setTimeout(function () {
                _self.setState({
                    clickNum: 0
                })
            }, 1500);
        }
    }

    onPressButton() {
        if (this.state.visitor == '') {
            Alert.alert("你名字都没有写！！！");
            return;
        }
        this.setState({
            visitor: ''
        })
        this.props.navigator.push({
            component: Home
        })
    }

    onKeyPress(e) {
        if (e.nativeEvent.key == 'Enter') {
            this.setState({
                visitor: ''
            })
            this.props.navigator.push({
                component: Home
            })
        }
    }

    render () {
        return (
            <ScrollView
                bounces={false}
                contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
                    <View style={styles.wrapper}>
                        <Image
                            resizeMode="contain"
                            style={styles.welcome}
                            source={require('./../resource/images/welcome.png')}
                            />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.onGoToSetting()}>
                            <Image
                                resizeMode="contain"
                                style={styles.caca}
                                source={require('./../resource/images/caca.png')}
                                />
                        </TouchableOpacity>
                        <View style={styles.content}>
                            <TextInput
                                style={styles.input}
                                placeholder="姓名／name"
                                returnKeyType="go"
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={this.state.visitor}
                                enablesReturnKeyAutomatically={true}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChangeText={(text) => {
                                    var _self = this;
                                    this.setState({
                                        visitor: text
                                    },function () {
                                        Server.setVisitor(this.state.visitor);
                                        console.log(Server.getVisitor())
                                    })}
                                }
                              />
                            <TouchableHighlight
                                style={styles.button_go}
                                onPress={() => this.onPressButton()}>
                                <Image
                                    resizeMode="contain"
                                    style={styles.button_go}
                                    source={require('./../resource/images/button_go.png')}
                                    />
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.logoWrapper}>
                        <Image
                            resizeMode="contain"
                            style={styles.logo}
                            source={require('./../resource/images/logo.png')}
                            />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 20,
    backgroundColor: '#FDD339',
  },
  wrapper: {
    flex: 1,
    marginTop: 100*ratio,
    marginBottom: 160*ratio,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  welcome: {
    width: 467*ratio,
    height: 72*ratio
  },
  caca: {
    width: 544*ratio,
    height: 544*ratio
  },
  content: {
    flexDirection: 'row'
  },
  input: {
    width: 504*ratio,
    height: 107*ratio,
    marginRight: 27*ratio,
    paddingHorizontal: 30*ratio,
    borderRadius: 5,
    fontSize: 40*ratio,
    backgroundColor: '#FFF'
  },
  button_go: {
    width: 134*ratio,
    height: 107*ratio,
    borderRadius: 5
  },
  logoWrapper: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
    marginRight: 20*ratio,
    marginBottom: 20*ratio
  },
  logo: {
    width: 280*ratio,
    height: 80*ratio,
    alignSelf: 'flex-end'
  }
});

module.exports = Main;