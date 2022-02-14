import React, {useState, useCallback, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import color from '../common/colors';
import {useNavigation} from '@react-navigation/native';
import {Card} from 'react-native-paper';
import {AuthContext} from '../context/AuthContext';
import {useEffect} from 'react/cjs/react.development';
import {useFocusEffect} from '@react-navigation/native';
import {setDocumentType} from 'parse5/lib/tree-adapters/default';
import dayjs from 'dayjs';

const Notifications = () => {
  const {userCred, selectedLanguage} = useContext(AuthContext);
  const [notificationData, setNotificationData] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const jsonUserCred = JSON.parse(userCred);
  const token = jsonUserCred.data.token;

  const getNotifications = useCallback(async () => {
    setLoading(true);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/get-notification';

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'get',
        headers: headers,
      });

      const responseData = await response.json();
      if (responseData.error === true) {
        setNotificationData([]);
      } else {
        setNotificationData(responseData.data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      getNotifications();
    }, [getNotifications]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={color.themeRed} />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>
        <FlatList
          data={notificationData}
          ListEmptyComponent={() => (
            <View>
              <Text style={styles.title}>No Notifications To Show</Text>
            </View>
          )}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <Card
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      item.status === 'new'
                        ? color.inputBgGrey
                        : color.themeWhite,
                  },
                ]}>
                <Text
                  style={[
                    styles.title,
                    selectedLanguage === 'arabic' && {
                      textAlign: 'right',
                    },
                  ]}>
                  {item.message}
                </Text>
                <Text
                  style={[
                    styles.date,
                    selectedLanguage === 'arabic' && {
                      textAlign: 'right',
                    },
                  ]}>
                  {dayjs(item.modifydate).format('DD MMMM YYYY')}
                </Text>
              </Card>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.themeWhite,
  },
  screen: {
    flexGrow: 1,
    backgroundColor: color.themeWhite,
  },
  mainContainer: {
    paddingVertical: 30,
  },
  item: {
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  title: {
    color: color.titleBlack,
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    marginLeft: 10,
  },
  date: {
    color: '#B9B9B9',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Notifications;
