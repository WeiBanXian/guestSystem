import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  NavigatorBar,
  View
} from 'react-native';

import Home from './src/Home.js';
import Setting from './src/Setting.js';
import Purpose from './src/Purpose.js';

export default class AwesomeProject extends Component {

    componentWillMount() {
        console.disableYellowBox = true;
        console.warn('YellowBox is disabled.');
    }

    render () {
        return (
            <NavigatorIOS
                style={styles.container}
                barTintColor="#FDD339"
                tintColor="#FFF"
                titleTextColor="#FFF"
                initialRoute={{
                    component: Home,
                    title: '首页'
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navigator: {
    flex: 1
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
