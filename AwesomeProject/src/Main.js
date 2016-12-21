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
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';

import Home from './Home.js';
import Setting from './Setting.js';
import Server from './server.js';

import Spinner from 'react-native-spinkit';

const ratio = Dimensions.get('window').width / 1024;

export class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            goBtnOpacity: 1,
            visitor: '',
            showLoading: false,
            clickNum: 0,
            index: 2,
            types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
            size: 70,
            color: "#333333",
            isVisible: true
        };
    }

    componentWillMount() {
        var _self = this;
        AsyncStorage.multiGet(["historyList", "domain"], function (error, result) {
            if (result.length > 0) {
                Server.setDomain(result[1][1]);
                if (!result[1][1]) {
                    Alert.alert("连续点击caca五次，进行配置服务器地址！");
                } else {
                    _self.setState({
                        showLoading: true
                    }, function () {
                        _self.onTimer = setTimeout(function () {
                            Alert.alert("初始化失败，重新设置服务器地址！");
                            _self.setState({
                                showLoading: false
                            });
                        }, 1000);
                    })
                    console.log(Server.getDomain())
                    Server.requestListHosts(function () {
                        Server.requestListGuestPurpose(function () {
                            clearTimeout(_self.onTimer);
                            _self.setState({
                                showLoading: false
                            });
                        });
                    });
                }
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
            Alert.alert("请输入您的名字");
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
                <View style={[styles.loadingContainer, {left: this.state.showLoading?0:10000}]}>
                    <View style={styles.loadingWrapper}>
                        <Spinner style={styles.spinner} isVisible={this.state.isVisible} size={this.state.size} type={this.state.types[this.state.index]} color={this.state.color}/>
                        <Text style={styles.loadingText}>正在初始化...</Text>
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
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingWrapper: {
        width: 500*ratio,
        height: 240*ratio,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    loadingText: {
        marginTop: 20*ratio,
        fontSize: 36*ratio,
        color: '#3E98FF',
        textAlign: 'center'
    }
});

module.exports = Main;