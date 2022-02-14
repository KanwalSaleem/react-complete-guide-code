import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Linking,
} from 'react-native';
import Colors from '../Constants/Colors';
import {TabView, SceneMap} from 'react-native-tab-view';
import Analysis from '../Components/Analysis1/Analysis';
import Description from '../Components/Analysis1/Description';
import PrivateNotes from '../Components/Analysis1/PrivateNotes';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../Components/PrimaryButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-community/clipboard';

const Analysis1 = ({route}) => {
  console.log(route.params, 'asdasd');
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const FirstRoute = () => <Description params={route.params} />;

  const SecondRoute = () => <Analysis params={route.params} />;

  const ThirdRoute = () => <PrivateNotes params={route.params} />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const [routes, setRoutes] = useState([
    {key: 'first', title: 'Description'},
    {key: 'second', title: 'Analysis'},
    {key: 'third', title: 'Private Notes'},
  ]);

  const renderTabBar = props => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <React.Fragment key={i}>
              {index == i ? (
                <TouchableOpacity
                  style={styles.container}
                  onPress={() => {}}
                  activeOpacity={0.6}>
                  <LinearGradient
                    colors={['#0038F5', '#9F03FF']}
                    style={styles.gradientView}
                    start={{x: 0.1, y: 0.1}}
                    end={{x: 1, y: -0.1}}>
                    <Text style={styles.text}>{route.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.container}
                  onPress={() => setIndex(i)}
                  activeOpacity={0.6}>
                  <Text style={styles.text}>{route.title}</Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={{height: 25}}>
        {index === 0 && (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Sport </Text>
            <Text style={[styles.headerTitle, {color: Colors.primary}]}>
              {route.params.sports}
            </Text>
          </View>
        )}
      </View>

      <TabView
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: ThirdRoute,
        })}
        renderTabBar={renderTabBar}
        style={{marginTop: 10}}
      />
      <View style={styles.bottomBar}>
        <View style={styles.userIdContainer}>
          <Text style={styles.userIdTitle}>User ID</Text>
          {route.params.athleteName && (
            <Text style={styles.userIdText}>
              {route.params.athleteName.value}
            </Text>
          )}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              Clipboard.setString(`User ID ${route.params.athleteName.value}`),
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
          onPress={() => Linking.openURL('http://34.93.183.126:8503')}
          style={{height: 70, borderRadius: 50, width: '100%'}}
          childrenStyle={styles.childrenStyle}>
          View Analysis
        </PrimaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 10,
  },

  tabBar: {
    flexDirection: 'row',
  },
  container: {
    elevation: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 41,
    borderRadius: 30,
  },

  gradientView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 41,
    borderRadius: 30,
  },
  text: {
    color: Colors.offWhite,
    fontSize: 15,
    fontFamily: 'Epilogue-VariableFont_wght',
    fontWeight: 'bold',
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
  childrenStyle: {
    fontSize: 26,
    fontFamily: 'Inter-ExtraBold',
  },
  copyImage: {
    width: 24,
    height: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Analysis1;
