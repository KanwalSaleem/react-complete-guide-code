import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const BottomBar = props => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.homeContainer, styles.homeIcon]}
        // onPress={() => props.navigation.navigate('dashBoard')}
      >
        <Image source={require('../assets/Home.png')} style={styles.image} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.homeContainer]}
        onPress={() => navigation.navigate('analyse')}>
        <Image source={require('../assets/Gallery.png')} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeContainer}
        onPress={() => navigation.navigate('profile')}>
        <Image source={require('../assets/Profile.png')} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.homeContainer]}
        // onPress={() => props.navigation.navigate('analyse')}
      >
        <Image
          source={require('../assets/Statistic.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
    // <Tab.Navigator
    //   // tabBar={props => <MyTabBar {...props} />}
    //   screenOptions={{
    //     tabBarShowLabel: false,

    //     tabBarStyle: {
    //       backgroundColor: Colors.primary,
    //       borderRadius: 40,
    //       position: 'absolute',
    //       bottom: 20,
    //       height: 75,
    //       left: 15,
    //       right: 15,
    //       elevation: 0,
    //     },
    //   }}>
    //   <Tab.Screen
    //     name="dashBoard"
    //     component={DashBoard}
    //     options={{
    //       contentStyle: {
    //         backgroundColor: 'black',
    //       },
    //       headerStyle: {
    //         backgroundColor: 'black',
    //       },
    //       tabBarIcon: ({focused}) => (
    //         <TouchableOpacity
    //           style={[
    //             styles.homeContainer,
    //             focused && {backgroundColor: 'white'},
    //           ]}
    //           // onPress={() => props.navigation.navigate('dashBoard')}
    //         >
    //           <Image
    //             source={require('../assets/Home.png')}
    //             style={styles.image}
    //           />
    //         </TouchableOpacity>
    //       ),

    //       headerTitle: '',
    //       headerRight: () => (
    //         <TouchableOpacity style={{marginLeft: 10, marginTop: 0}}>
    //           <Icon name="add-circle" color={Colors.primary} size={43} />
    //         </TouchableOpacity>
    //       ),
    //       headerLeft: () => (
    //         <TouchableOpacity
    //           style={{marginLeft: 10, marginTop: 0}}
    //           onPress={() => props.navigation.toggleDrawer()}>
    //           <Image
    //             source={require('../assets/Menu.png')}
    //             style={{width: 26, height: 30}}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="menu"
    //     component={Menu}
    //     options={{
    //       headerShown: false,
    //       tabBarIcon: ({focused}) => (
    //         <TouchableOpacity
    //           disabled={true}
    //           style={[
    //             styles.homeContainer,
    //             focused && {backgroundColor: 'white'},
    //           ]}
    //           onPress={() => props.navigation.navigate('search')}>
    //           <Image
    //             source={require('../assets/Gallery.png')}
    //             style={styles.image}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="profile"
    //     component={Profile}
    //     options={{
    //       headerShown: false,
    //       tabBarIcon: ({focused}) => (
    //         <TouchableOpacity
    //           disabled
    //           style={[
    //             styles.homeContainer,
    //             focused && {backgroundColor: 'white'},
    //           ]}
    //           onPress={() => props.navigation.navigate('profile')}>
    //           <Image
    //             source={require('../assets/Profile.png')}
    //             style={styles.image}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     }}
    //   />
    //   <Tab.Screen
    //     name="analyse"
    //     component={Analyse}
    //     options={{
    //       headerShown: false,
    //       tabBarIcon: ({focused}) => (
    //         <TouchableOpacity
    //           style={[
    //             styles.homeContainer,
    //             focused && {backgroundColor: 'white'},
    //           ]}
    //           onPress={() => props.navigation.navigate('analyse')}>
    //           <Image
    //             source={require('../assets/Statistic.png')}
    //             style={styles.image}
    //           />
    //         </TouchableOpacity>
    //       ),
    //     }}
    //   />
    // </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    position: 'absolute',
    bottom: 20,
    width: '85%',
    height: 75,
    //       bottom: 20,
    //       height: 75,
    //       left: 15,
    //       right: 15,
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  homeContainer: {
    marginHorizontal: 20,
  },
  image: {
    resizeMode: 'contain',
    width: 24,
    height: 21,
  },
});

export default BottomBar;
