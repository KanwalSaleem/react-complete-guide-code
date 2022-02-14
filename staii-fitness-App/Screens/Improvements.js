import React, {Component} from 'react';
import {
  StyleSheet,
  Animated,
  Button,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  ToastAndroid,
} from 'react-native';
import SliderText from '../Components/SliderText';
import ModelView from 'react-native-gl-model-view';
import Colors from '../Constants/Colors';
import PrimaryButton from '../Components/PrimaryButton';
import Slider from 'react-native-slider';
import Clipboard from '@react-native-community/clipboard';
const AnimatedModelView = Animated.createAnimatedComponent(ModelView);
export default class Improvements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateX: new Animated.Value(0),
      rotateZ: new Animated.Value(0),
      scale: 0.26,
      fromXY: undefined,
      valueXY: undefined,
      userid: this.props.route.params.athleteName.value,
    };
  }
  componentDidMount() {
    console.log(this.state.userid);
  }
  data = [
    {
      key: '1',
      firstname: 'Thigh',
      lastname: 'Muscle',
    },
    {
      key: '2',
      firstname: 'Thoraci',
      lastname: 'Walls',
    },
    {
      key: '3',
      firstname: 'knee',
      lastname: 'bone',
    },
    {
      key: '4',
      firstname: 'hip bone',
      lastname: 'snipe',
    },
  ];

  onMoveEnd = () => {
    this.setState({
      fromXY: undefined,
    });
  };

  onMove = e => {
    let {pageX, pageY} = e.nativeEvent,
      {rotateX, rotateZ, fromXY, valueXY} = this.state;
    if (!this.state.fromXY) {
      this.setState({
        fromXY: [pageX, pageY],
        valueXY: [rotateZ.__getValue(), rotateX.__getValue()],
      });
    } else {
      rotateZ.setValue(valueXY[0] + (pageX - fromXY[0]) / 2);
      rotateX.setValue(valueXY[1] + (pageY - fromXY[1]) / 2);
    }
  };

  render() {
    let {rotateZ, rotateX, fromXY, scale, userid} = this.state;

    return (
      <View style={styles.container}>
        <View style={{flexGrow: 0}}>
          <SliderText data={this.data} />
        </View>
        <View style={{flex: 1}}>
          <View style={{height: 800}}>
            <AnimatedModelView
              model={{
                uri: 'test.obj',
              }}
              texture={{
                uri: 'tt.jpg',
              }}
              onStartShouldSetResponder={() => true}
              onResponderRelease={this.onMoveEnd}
              onResponderMove={this.onMove}
              animate={!!fromXY}
              tint={{r: 1.0, g: 1.0, b: 1.0, a: 1.0}}
              scale={scale}
              rotateX={rotateX}
              rotateZ={rotateZ}
              translateZ={-5.0}
              style={styles.module3d}
            />
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            value={scale}
            minimumValue={0.18}
            maximumValue={0.32}
            onValueChange={scale => this.setState({scale})}
          />
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.userIdContainer}>
            <Text style={styles.userIdTitle}>User ID</Text>
            {userid && <Text style={styles.userIdText}>{userid}</Text>}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                Clipboard.setString(`User ID ${userid}`),
                  ToastAndroid.show(
                    'Copied to clipboard',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                  );
              }}>
              <Image
                source={require('../assets/copyImage.png')}
                style={styles.copyImage}
              />
            </TouchableOpacity>
          </View>
          <PrimaryButton
            onPress={() => Linking.openURL('http://34.93.23.234:8503')}
            style={{height: 70, borderRadius: 50, width: '90%'}}
            childrenStyle={styles.childrenStyle}>
            View Analysis
          </PrimaryButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  module3d: {
    flex: 1,
    elevation: 1,
    backgroundColor: 'pink',
    justifyContent: 'center',
  },
  sliderContainer: {
    width: '70%',
    alignSelf: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    marginBottom: 15,
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  userIdTitle: {
    color: '#8C8B9B',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },

  userIdText: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Inter-ExtraBold',
    paddingHorizontal: 15,
  },
  copyImage: {
    width: 24,
    height: 24,
  },
  buttonText: {
    fontSize: 20,
  },
  childrenStyle: {
    fontSize: 26,
    fontFamily: 'Inter-ExtraBold',
  },
});
