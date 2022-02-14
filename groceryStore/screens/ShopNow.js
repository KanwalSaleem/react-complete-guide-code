import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import {Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {APIURL} from '../constants/Url';

const ShopNow = () => {
  const navigation = useNavigation();
  const [mainCategory, setMainCategory] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const getMainCategories = useCallback(async () => {
    try {
      let base_url = `${APIURL}/API/main_categories.php`;

      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();

      if (responseData.status === false) {
        // throw new Error(responseData.Message);
      } else {
        setMainCategory(responseData.Data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMainCategories();
  }, [getMainCategories]);

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <View style={styles.screen}>
      <Text style={styles.title}>Shop by category</Text>
      <ScrollView contentContainerStyle={styles.cardMainContainer}>
        <Card style={styles.cardContainer}>
          <Card.Content style={styles.mainProductContainer}>
            {mainCategory.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate('subCategory', {
                      mainCategoryId: item.id,
                    })
                  }
                  style={styles.itemView}>
                  <Image
                    style={styles.itemImage}
                    source={{
                      uri: `${APIURL}/admin_panel/Uploads/${item.img}`,
                    }}
                  />
                  <Text style={styles.itemText}>{item.name.toUpperCase()}</Text>
                </TouchableOpacity>
              );
            })}
          </Card.Content>
        </Card>
      </ScrollView>
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

  title: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  cardMainContainer: {},
  cardContainer: {
    // paddingVertical: 10,
    marginVertical: 10,
  },
  mainProductContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  itemView: {
    alignItems: 'center',
    width: '32%',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  itemText: {
    marginTop: 20,
    fontSize: 12,
    color: Colors.grey,
    fontFamily: 'OpenSans-Regular',
  },
  itemImage: {
    width: '100%',
    height: 90,
  },
});

export default ShopNow;
