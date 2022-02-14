import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import colors from '../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HouseSingleProperty from '../components/Common/HouseSingleProperty';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

const MyListingDetails = ({route, navigation}) => {
  const {p_id} = route.params;
  const [isLoading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const {userCred} = useContext(AuthContext);
  const jsonUserCred = JSON.parse(userCred);

  const getSingleProperty = useCallback(async () => {
    setLoading(true);

    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/single-properties';
      let uploadData = new FormData();

      uploadData.append('p_id', p_id);
      uploadData.append('userid', jsonUserCred.data.user.id);
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        throw new Error(responseData.message);
      } else {
        setPropertyData(responseData.data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [jsonUserCred.data.user.id, p_id]);
  useFocusEffect(
    useCallback(() => {
      getSingleProperty();
    }, [getSingleProperty]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={colors.themeRed} />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.screen}>
      <HouseSingleProperty data={propertyData} myListing={true} pId={p_id} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: colors.themeWhite,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyListingDetails;
