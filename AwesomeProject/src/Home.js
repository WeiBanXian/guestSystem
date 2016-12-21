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

class Home extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            dataPurposeSource: ds.cloneWithRows([]),
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
        // Server.setListGuestPurposeData([]);
        // Server.setListHostsData([]);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var purposeData = Server.getListGuestPurposeData() || [];
        var listHostsData = Server.getListHostsData() || [];
        console.log(purposeData.length)
        if (purposeData.length == 0 || listHostsData.length == 0) {
            AlertIOS.alert(
              "请设置服务器，初始化数据",
              '',
              [
                {text: 'OK', onPress: () => this.props.navigator.pop()}
              ]
            )
        }
        _self.setState({
            listHosts: [],
            dataPurposeSource: ds.cloneWithRows(purposeData),
            showLoading: false
        }, function () {
            Server.setSelectedPurpose(_self.state.selectedPurpose);
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
        if (Server.getSelectedPurpose() != "面试") {
            if (this.isEmptyObject(this.state.hostData)) {
                AlertIOS.alert("请输入接访人");
                return;
            }
            if (this.state.selectedPurpose == '') {
                AlertIOS.alert("请选择来访目的");
                return;
            }
        }
        this.setState({
            showLoading: true
        })
        Server.guestForm(function () {
            _self.setState({
                showLoading: false
            })
            _self.props.navigator.pop()
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

    onChose(hostData) {
        var _self = this;
        this.setState({
            hostData: hostData,
            showSearch: false
        }, function () {
            Server.setHostData(_self.state.hostData);
            // console.log(Server.getHostData())
        });
    }

    onSelect(purpose) {
        if (purpose == '面试') {
            AlertIOS.prompt('请输入您的手机号', null, [{
                        text: '确定',
                        onPress: (text) => {
                            Server.setVisitorPhone(text)
                            this.onPressButton();
                        }
                    }, {
                      text: '取消',
                      style: 'cancel',
                    }],
                    "plain-text")
        }
        var _self = this;
        var purposeData = Server.getListGuestPurposeData();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            selectedPurpose: purpose,
            showSearch: false,
            dataPurposeSource: ds.cloneWithRows(purposeData)
        }, function () {
            Server.setSelectedPurpose(_self.state.selectedPurpose);
        });
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

    renderPurposeRow(rowData) {
        var textColor = '#666';
        if (rowData == this.state.selectedPurpose) {
            textColor = '#3E98FF';
        }
        return (
            <TouchableHighlight
                underlayColor="#DDD"
                onPress={() => this.onSelect(rowData)}>
                <Text style={[styles.valueText, {color: textColor, backgroundColor: 'rgba(255,255,255,0)'}]}>{rowData}</Text>
            </TouchableHighlight>
        );
    }

    renderSeparator(rowData) {
        return (<View style={styles.line} />)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <View style={styles.content}>
                        <Text style={styles.label}>接访人／Host</Text>
                        <TextInput
                            style={[styles.hostText, styles.borderText]}
                            placeholder="姓名／Name"
                            placeholderTextColor="#3E98FF"
                            onChangeText={(text) => this.onChangeText(text)}
                            onBlur={this.onTextInputBlur}
                            defaultValue={this.state.hostData.name}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            clearButtonMode={'while-editing'}
                          />
                        <Text style={styles.label}>来访目的／Purpose</Text>
                        <View style={styles.purposeWrapper}>
                            <ListView
                                dataSource={this.state.dataPurposeSource}
                                renderRow={this.renderPurposeRow.bind(this)}
                                renderSeparator ={this.renderSeparator}
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
                        <View style={
                            [
                                styles.searchWrapper,
                                {
                                    top: this.state.showSearch?120:-999
                                }
                            ]}>
                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow.bind(this)}
                                renderSeparator ={this.renderSeparator}
                                removeClippedSubviews={false}
                                bounces={false}
                                />
                        </View>
                        <Image
                            style={styles.caca}
                            resizeMode="cover"
                            source={require('./../resource/images/caca2.png')}
                            />
                    </View>
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
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    wrapper: {
        flex: 1,
        paddingTop: 120*ratio,
        justifyContent: 'center',
        alignItems: 'center'
    },
    caca: {
        position: 'absolute',
        top: -124*ratio,
        right: -30*ratio,
        width: 200*ratio,
        height: 200*ratio
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
    hostText: {
        marginBottom: 40*ratio
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
    searchWrapper: {
        position: 'absolute',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E1E1E1',
        backgroundColor: '#FAFAFA',
        top: 120*ratio
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
    purposeWrapper: {
        width: 667*ratio,
        height: 432*ratio,
        marginBottom: 40*ratio,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E1E1E1',
        backgroundColor: '#FFF',
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

export default Home;