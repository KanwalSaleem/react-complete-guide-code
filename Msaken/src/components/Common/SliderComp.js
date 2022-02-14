import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../../common/colors';
import {useNavigation} from '@react-navigation/native';

const SliderComp = props => {
  const navigation = useNavigation();
  const window = useWindowDimensions();

  return (
    <SliderBox
      ImageComponent={props => (
        <Image
          {...props}
          style={{
            width: window.width < 400 ? window.width - 18 : window.width - 20,
            height: 200,
          }}
        />
      )}
      images={props.images}
      ImageComponentStyle={props.sliderStyle}
      activeOpacity={0.6}
      // autoplay={true}
      circleLoop={true}
      onCurrentImagePressed={props.onCurrentImagePressed}
      dotColor={colors.themeRed}
      inactiveDotColor={colors.themeWhite}
      dotStyle={{
        marginHorizontal: -15,
      }}
    />
    // </View>
  );
};

export default React.memo(SliderComp);
