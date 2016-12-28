'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Image,
    AlertIOS,
    ListView,
    Dimensions,
    ActivityIndicator,
    TouchableHighlight
} from 'react-native';

import Server from './server.js';
import Spinner from 'react-native-spinkit';

const ratio = Dimensions.get('window').width / 1024;

class Phone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            index: 2,
            types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
            size: 70,
            color: "#333333",
            isVisible: true,
            phone: ''
        };
    }

    componentWillMount() {
    }

    onPressButton() {
        var _self = this;
        if (this.state.phone == '') {
            AlertIOS.alert("请输入您的电话号码");
            return;
        }
        Server.setVisitorPhone(this.state.phone)
        this.setState({
            showLoading: true
        })
        Server.guestForm(function () {
            _self.setState({
                showLoading: false
            })
            _self.props.navigator.popToTop()
        }, function () {
            AlertIOS.alert("服务器忙，请重试！");
            _self.setState({
                showLoading: false
            })
        });
    }

    onChangeText(text) {
        this.setState({
            phone: text
        })
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <Text style={styles.label}>联系方式／Contact</Text>
                    <TextInput
                        style={styles.borderText}
                        placeholder="联系方式／Contact"
                        placeholderTextColor="#3E98FF"
                        onChangeText={(text) => this.onChangeText(text)}
                        onBlur={this.onTextInputBlur}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType="phone-pad"
                        clearButtonMode={'while-editing'}
                      />
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor="#F0D030"
                        onPress={() => this.onPressButton()}>
                        <Text style={styles.buttonText}>完成</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.logoWrapper}>
                    <Image
                        resizeMode="contain"
                        style={styles.logo}
                        source={require('./../resource/images/logo_y.png')}
                        />
                </View>
                <View style={[styles.loadingContainer, {left: this.state.showLoading?0:10000}]}>
                    <View style={styles.loadingWrapper}>
                        <Spinner style={styles.spinner} isVisible={this.state.isVisible} size={this.state.size} type={this.state.types[this.state.index]} color={this.state.color}/>
                        <Text style={styles.loadingText}>请稍等，正在提交...</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 40*ratio,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 30*ratio,
        color: '#999',
        marginBottom: 13*ratio
    },
    borderText: {
        width: 667*ratio,
        height: 107*ratio,
        paddingHorizontal: 30*ratio,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E1E1E1',
        color: '#3E98FF',
        fontSize: 37*ratio,
        lineHeight: 107*ratio,
        textAlign: 'center',
        backgroundColor: '#FFF'
    },
    button: {
        width: 667*ratio,
        height: 107*ratio,
        marginTop: 120*ratio,
        borderRadius: 5,
        backgroundColor: '#FDD339',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 40*ratio,
        color: '#FFF',
    },
    logoWrapper: {
        position: 'absolute',
        right: 20*ratio,
        bottom: 20*ratio
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
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 20*ratio,
        fontSize: 36*ratio,
        color: '#3E98FF',
        textAlign: 'center'
    }
});

export default Phone;