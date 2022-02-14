import {useNavigation} from '@react-navigation/core';
import React, {useState, useContext, useEffect} from 'react';
import MON from 'react-native-vector-icons/MaterialIcons';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ION from 'react-native-vector-icons/Ionicons';
import color from '../common/colors';
import OTP from './OTP';
import Toast from 'react-native-simple-toast';
import services from '../common/service';
import colors from '../common/colors';
import {AuthContext} from '../context/AuthContext';
import {useFocusEffect} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

function PrivacyPolicy({route, navigation}) {
  const [privacyData, setPrivacyData] = useState();
  const [isLoading, setLoading] = useState(false);

  const getPrivacyPolicy = async () => {
    setLoading(true);
    try {
      let base_url = 'https://xionex.in/msaken/admin/public/api/getpagecontent';

      const headers = new Headers();
      // headers.append('Authorization', `Bearer ${token}`);

      // formdata.append('userid', jsonUserCred.data.user.id);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'get',
        // headers: headers,
      });

      const responseData = await response.json();

      setPrivacyData(responseData?.data?.privacy?.content);
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  useEffect(() => getPrivacyPolicy(), []);
  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}> */}
      <WebView
        originWhitelist={['*']}
        source={{
          html: `
              <html>
                <head>
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  />
                </head>
                <body>${privacyData ? privacyData : '<p></p>'}</body>
              </html>
            `,
        }}
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  text: {
    paddingTop: 10,
    fontSize: 14,
    color: colors.darkGrey,
    fontFamily: 'Roboto-Regular',
  },
});

export default PrivacyPolicy;
