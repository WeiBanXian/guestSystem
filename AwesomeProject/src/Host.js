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

class Host extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            listHosts: [],
            hostData: {},
            selectedPurpose: '其他',
            showLoading: false,
            showSearch: true,
            index: 2,
            types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
            size: 70,
            color: "#333333",
            isVisible: true
        };
    }

    componentWillMount() {
        var _self = this;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var listHostsData = Server.getListHostsData() || [];
        if (listHostsData.length == 0) {
            AlertIOS.alert(
              "请设置服务器，初始化数据",
              '',
              [
                {text: 'OK', onPress: () => this.props.navigator.popToTop()}
              ]
            )
        } else {
            this.setState({
                dataSource: ds.cloneWithRows(listHostsData),
                listHosts: [],
                showLoading: false
            });
        }
    }

    onChose(hostData) {
        var _self = this;
        this.setState({
            hostData: hostData,
            showSearch: false
        }, function () {
            Server.setHostData(_self.state.hostData);
        });
    }

    isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    onPressButton() {
        var _self = this;
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
        var data = this.state.listHosts;
        var search = Server.Filter(text);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(search),
            showSearch: true
        })
        if (text == '') {
            this.setState({
                showSearch: false
            })
        }
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight
                underlayColor="#F0D030"
                onPress={() => this.onChose(rowData)}>
                <Text style={styles.valueText}>{rowData.name}</Text>
            </TouchableHighlight>
        );
    }

    renderSeparator(rowData) {
        return (<View style={styles.line} />)
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <Text style={styles.label}>接访人／Host</Text>
                    <TextInput
                        style={styles.borderText}
                        placeholder="姓名／Name"
                        placeholderTextColor="#3E98FF"
                        onChangeText={(text) => this.onChangeText(text)}
                        onBlur={this.onTextInputBlur}
                        defaultValue={this.state.hostData.name}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        clearButtonMode={'while-editing'}
                      />
                    <View style={styles.searchWrapper}>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow.bind(this)}
                            renderSeparator ={this.renderSeparator}
                            automaticallyAdjustContentInsets={false}
                            removeClippedSubviews={false}
                            bounces={false}
                            />
                    </View>
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
    searchWrapper: {
        height: 535*ratio,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E1E1E1',
        backgroundColor: '#FAFAFA',
        marginBottom: 40*ratio
    },
    line: {
        height: 1,
        backgroundColor: '#E1E1E1'
    },
    valueText: {
        width: 667*ratio,
        height: 107*ratio,
        paddingHorizontal: 30*ratio,
        color: '#666',
        fontSize: 37*ratio,
        lineHeight: 107*ratio,
        textAlign: 'center',
        backgroundColor: '#FAFAFA'
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


export default Host;