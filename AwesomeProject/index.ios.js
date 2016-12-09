import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  NavigatorBar,
  View
} from 'react-native';

import Home from './src/Home.js';
import Main from './src/Main.js';
import Setting from './src/Setting.js';

export default class AwesomeProject extends Component {

    componentWillMount() {
        console.disableYellowBox = true;
        console.warn('YellowBox is disabled.');
    }

    router(route, navigator) {
        var ComponentClass = route.component,
        rightView = route.rightView,
        title = route.title,
        onPress = route.onPress,
        rightWrapperStyle = route.rightWrapperStyle,
        props = route.passProps;
        return (
            <route.component navigator={navigator}  {...route} />
        );
    }

    render () {
        return (
            <View style={styles.container}>
                <Navigator
                    style={styles.navigator}
                    configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
                    initialRoute={{
                        component: Main
                    }}
                    renderScene={this.router} />
            </View>
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
