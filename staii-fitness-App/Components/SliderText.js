import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import Colors from '../Constants/Colors';

const SliderText = props => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const {width: windowWidth} = useWindowDimensions();

  /*
   * On ScrollEnd Calculate and set Current page
   */

  return (
    <ScrollView
      horizontal={true}
      style={styles.scrollContainer}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event(
        [
          // null,
          {
            nativeEvent: {
              contentOffset: {
                x: scrollX,
              },
            },
          },
        ],
        {useNativeDriver: false},
      )}
      scrollEventThrottle={1}>
      {props.data.map(data => {
        return (
          <View style={{width: windowWidth - 50}} key={data.key}>
            <View style={styles.content}>
              <Text style={styles.maintitle}>{data.firstname}</Text>
              <Text style={styles.secondarytitle}>{data.lastname}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default SliderText;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingLeft: 20,
  },

  maintitle: {
    color: 'white',
    fontFamily: 'Inter-ExtraBold',
    fontSize: 30,
  },
  secondarytitle: {
    color: Colors.datkGrey,
    fontFamily: 'Inter-ExtraBold',
    fontSize: 30,
  },
});
