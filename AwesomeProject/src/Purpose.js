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
import Host from './Host.js';
import Phone from './Phone.js';
import Spinner from 'react-native-spinkit';

const ratio = Dimensions.get('window').width / 1024;

class Purpose extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            selectedPurpose: '其他',
            showLoading: false,
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
        var purposeData = Server.getListGuestPurposeData() || [];
        if (purposeData.length == 0) {
            AlertIOS.alert(
              "请设置服务器，初始化数据",
              '',
              [
                {text: 'OK', onPress: () => this.props.navigator.popToTop()}
              ]
            )
        }
        _self.setState({
            dataSource: ds.cloneWithRows(purposeData),
            showLoading: false
        }, function () {
            Server.setSelectedPurpose(_self.state.selectedPurpose);
        });
    }

    onSelect(purpose) {
        var _self = this;
        var purposeData = Server.getListGuestPurposeData();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            selectedPurpose: purpose,
            showSearch: false,
            dataSource: ds.cloneWithRows(purposeData)
        }, function () {
            Server.setSelectedPurpose(_self.state.selectedPurpose);
            if (purpose == "面试") {
                Server.setHostData(null);
                _self.props.navigator.push({
                    component: Phone,
                    title: "联系方式"
                });
            } else {
                Server.setVisitorPhone(null);
                _self.props.navigator.push({
                    component: Host,
                    title: "接访人"
                });
            }
        });
    }

    renderRow(rowData) {
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
                        <Text style={styles.label}>来访目的／Purpose</Text>
                        <View style={styles.purposeWrapper}>
                            <ListView
                                style={styles.listView}
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow.bind(this)}
                                renderSeparator ={this.renderSeparator}
                                removeClippedSubviews={false}
                                bounces={false}
                                automaticallyAdjustContentInsets={false}
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
    line: {
        height: 1,
        backgroundColor: '#E1E1E1'
    },
    purposeWrapper: {
        width: 667*ratio,
        height: 432*ratio,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E1E1E1',
        backgroundColor: '#FFF',
    },
    listView: {
        flex: 1
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

export default Purpose;