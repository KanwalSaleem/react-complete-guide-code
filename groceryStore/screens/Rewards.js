import React, {useState, useContext, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context/Auth';
import {APIURL} from '../constants/Url';

const Rewards = () => {
  const {isAuthenticated, userDetails} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [RewardsData, setRewardsData] = useState([]);

  const getRewards = useCallback(async () => {
    setLoading(true);
    setRewardsData([]);
    try {
      let base_url = `${APIURL}/API/getrewards.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('user_id', userDetails.user_id);
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        throw new Error(responseData.Message);
      } else {
        setRewardsData(responseData.Data);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, [userDetails.user_id]);

  useFocusEffect(
    useCallback(() => {
      isAuthenticated && getRewards();
    }, [getRewards, isAuthenticated]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <View style={styles.screen}>
      <LinearGradient colors={['#E03D14', '#E0CD14']} style={styles.gradient}>
        <View style={styles.iconContainer}>
          <Icon color={Colors.black} name="shopping-bag" size={60} />
          <Text style={styles.text}>SHOP</Text>
        </View>

        <Icon color={Colors.black} name="arrow-forward" size={60} />

        <View style={styles.iconContainer}>
          <Icon color={Colors.black} name="monetization-on" size={60} />
          <Text style={styles.text}>Earn</Text>
        </View>
        <Icon color={Colors.black} name="arrow-forward" size={60} />

        <View style={styles.iconContainer}>
          <Icon color={Colors.black} name="redeem" size={60} />
          <Text style={styles.text}>Earn</Text>
        </View>
      </LinearGradient>
      <View style={styles.rewardsContainer}>
        <Image style={styles.image} source={require('../assets/rewards.png')} />
        <Text style={styles.rewardTitle}>My Reward points</Text>
        <Text style={styles.rewardTitle}>
          {isAuthenticated ? RewardsData.Rewards_points : 0}
        </Text>
      </View>
      <AuthButton style={styles.button} disabled={true}>
        Redeem Points
      </AuthButton>
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },

  button: {
    marginVertical: 20,
    backgroundColor: Colors.secondary,
  },
  gradient: {
    flexDirection: 'row',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
  },
  rewardsContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: '70%',
    height: 120,
  },
  rewardTitle: {
    marginTop: 5,
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
});

export default Rewards;
