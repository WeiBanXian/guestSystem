'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Image,
    Alert,
    Text,
    Dimensions,
    TextInput,
    ListView,
    AsyncStorage,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';

import Server from './server.js';
import Spinner from 'react-native-spinkit';

const ratio = Dimensions.get('window').width / 1024;

class Setting extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            historyList: [],
            deleteData: '',
            showLoading: false,
            inputData: '',
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
                if (result[1][1]) {
                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    _self.setState({
                        dataSource: ds.cloneWithRows(JSON.parse(result[0][1]).reverse()),
                        historyList: JSON.parse(result[0][1]),
                        inputData: result[1][1]
                    }, function () {
                        // Alert.alert(JSON.stringify(_self.state.dataSource))
                    })
                    Server.setDomain(result[1][1]);
                }
            }
        });
    }

    onPressButton() {
        var _self = this;
        var inputData = this.state.inputData+'';
        if (inputData == '') {
            Alert.alert('请设置服务地址')
            return;
        }
        Server.setDomain(inputData);
        var historyList = this.state.historyList;
        historyList.push(inputData);
        // 去重
        Array.prototype.unique = function(){
            var res = [];
            var json = {};
            for(var i = 0; i < this.length; i++){
                if(!json[this[i]]){
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }
        historyList = historyList.unique();
        AsyncStorage.multiGet(["historyList", "domain"], function (error, result) {
            if (result.length > 0) {
                if (result[1][1] == inputData) {
                    _self.props.navigator.pop()
                } else {
                    _self.setState({
                        showLoading: true
                    }, function () {
                        _self.timer = setTimeout(function () {
                            Alert.alert("新设置地址不正确，重新设置服务器地址！");
                            _self.setState({
                                showLoading: false
                            });
                        }, 20000);
                    })
                    AsyncStorage.multiSet([["historyList", JSON.stringify(historyList)], ["domain", inputData]], function (error) {
                        if (error) {
                            console.warn(error)
                        } else {
                            Server.setDomain(inputData);
                            Server.requestListHosts(function () {
                                Server.requestListGuestPurpose(function () {
                                    clearTimeout(_self.timer);
                                    _self.setState({
                                        showLoading: false
                                    });
                                    _self.props.navigator.pop()
                                });
                            });
                        }
                    });
                }
            }
        });
    }

    onChose(data) {
        var inputData = data + '';
        this.setState({
            inputData: inputData
        })
    }

    onDelete(data) {
        var historyList = this.state.historyList;
        for (var i in historyList) {
            if (data == historyList[i]) {
                historyList.splice(i, 1);
            }
        }
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            dataSource: ds.cloneWithRows(historyList),
            historyList: historyList
        })
        AsyncStorage.setItem("historyList", JSON.stringify(historyList), function (error) {
            if (error) {
                console.warn(error)
            }
        });
    }

    onChangeText(text) {
        this.setState({
            inputData: text
        })
    }

    renderRow(rowData) {
        return (
            <TouchableHighlight
                underlayColor="#F0D030"
                onPress={() => this.onChose(rowData)}
                >
                <View style={styles.valueWrapper}>
                    <Text style={styles.valueText}>{rowData}</Text>
                    <Image
                        style={styles.deleteImg}
                        onStartShouldSetResponder={() => true}
                        onResponderRelease={() => this.onDelete(rowData)}
                        source={require('../resource/images/delete.png')}
                        />
                </View>
            </TouchableHighlight>
        );
    }

    renderSeparator(rowData) {
        return (<View style={styles.line} />)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="服务器地址"
                                placeholderTextColor="#3E98FF"
                                multiline={false}
                                onChangeText={(text) => this.onChangeText(text)}
                                onBlur={this.onTextInputBlur}
                                defaultValue={this.state.inputData}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                // clearButtonMode={'while-editing'}
                                />
                        </View>
                        <TouchableOpacity
                            style={styles.buttonWrapper}
                            activeOpacity={0.6}
                            onPress={() => this.onPressButton()}>
                            <Text style={styles.button}>确认</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.historyWrapper}>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow.bind(this)}
                            renderSeparator={this.renderSeparator}
                            removeClippedSubviews={false}
                            />
                    </View>
                </View>
                <View style={[styles.loadingContainer, {left: this.state.showLoading?0:10000}]}>
                    <View style={styles.loadingWrapper}>
                        <Spinner style={styles.spinner} isVisible={this.state.isVisible} size={this.state.size} type={this.state.types[this.state.index]} color={this.state.color}/>
                        <Text style={styles.loadingText}>正在重置服务地址...</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9'
    },
    header: {
        paddingHorizontal: 20*ratio,
        paddingTop: 20,
        height: 108*ratio,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FDD339'
    },
    backWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backImg: {
        width: 40*ratio,
        height: 40*ratio,
        opacity: 1
    },
    backText: {
        fontSize: 30*ratio,
        color: '#FFF'
    },
    title: {
        flex: 1,
        fontSize: 36*ratio,
        textAlign: 'center',
        color: '#FFF'
    },
    blank: {
        flex: 1,
        height: 30
    },
    content: {
        flex: 1,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20*ratio
    },
    inputContainer: {
        flex: 7,
        height: 107*ratio
    },
    input: {
        flex: 1,
        paddingHorizontal: 20*ratio,
        borderRadius: 10,
        fontSize: 36*ratio,
        backgroundColor: '#EFEFEF',
        color: '#3E98FF'
    },
    buttonWrapper: {
        flex: 1,
        marginLeft: 10*ratio,
        height: 107*ratio,
        backgroundColor: '#3E98FF',
        borderRadius: 10
    },
    button: {
        fontSize: 36*ratio,
        lineHeight: 107*ratio,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#FFF',
        borderRadius: 10
    },
    historyWrapper: {
        flex: 2,
        paddingTop: 40*ratio,
        paddingHorizontal: 40*ratio,
    },
    valueWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20*ratio,
        backgroundColor: '#EEE'
    },
    valueText: {
        flex: 1,
        height: 107*ratio,
        color: '#666',
        fontSize: 37*ratio,
        lineHeight: 107*ratio,
        backgroundColor: '#EEE'
    },
    deleteImg: {
        width: 40*ratio,
        height: 40*ratio,
        borderRadius: 20*ratio,
        backgroundColor: '#CCC'
    },
    line: {
        height: 1,
        backgroundColor: '#E1E1E1'
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
        backgroundColor: 'rgba(255,255,255,0.9)'
    },
    loadingText: {
        marginTop: 20*ratio,
        fontSize: 36*ratio,
        color: '#3E98FF',
        textAlign: 'center'
    }
});


export default Setting;