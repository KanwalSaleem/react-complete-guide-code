import React, {useCallback, useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors';
import {SliderBox} from 'react-native-image-slider-box';
import {Card, Title} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import OneSignal from 'react-native-onesignal';
import {APIURL} from '../constants/Url';

const Dashboard = () => {
  const Colors = [
    '#C2F1BE',
    '#F1F1BE',
    '#BFC9F2',
    '#B8D9F0',
    '#F2ADA4',
    '#A4F2DE',
    '#C2A4F2',
    '#ECA4F2',
    '#F2A4C9',
    '#F2A4B7',
    '#DAF2A4',
    '#B8D9F0',
    '#F1F1BE',
    '#BFC9F2',
    '#B8D9F0',
    '#F2ADA4',
    '#A4F2DE',
    '#C2A4F2',
    '#ECA4F2',
    '#F2A4C9',
    '#F2A4B7',
    '#DAF2A4',
    '#C2F1BE',
  ];

  const navigation = useNavigation();
  const [mainCategory, setMainCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const {setSubCategoryId} = useContext(AuthContext);
  const [categorySliderImages, setCatategorySliderImages] = useState([]);
  const [discountSliderImages, setDiscountSliderImages] = useState([]);

  const getCategorySlider = useCallback(async () => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getsliders.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('type', 'slider');

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        // throw new Error(responseData.Message);
      } else {
        const categoryImages = [];
        responseData.Data.map((item, index) => {
          categoryImages.push(`${APIURL}/admin_panel/Uploads/${item.img}`);
        });
        setCatategorySliderImages(categoryImages);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, []);

  const getdiscountSlider = useCallback(async () => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getsliders.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      form.append('type', 'discount');

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        // throw new Error(responseData.Message);
      } else {
        const discountImages = [];
        responseData.Data.map((item, index) => {
          discountImages.push(`${APIURL}/admin_panel/Uploads/${item.img}`);
        });
        setDiscountSliderImages(discountImages);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, []);

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

  const getSubCategories = useCallback(async () => {
    try {
      let base_url = `${APIURL}/API/getAll_subcategories.php`;

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
        setSubCategory(responseData.Data);
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMainCategories(),
      getSubCategories(),
      getCategorySlider(),
      getdiscountSlider();
  }, []);

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color="#060F4C" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchInnerView}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('search')}>
          <Image
            style={styles.logo}
            source={require('../assets/logoImg.png')}
          />

          <Text style={styles.searchInput}>Search For More..</Text>
        </TouchableOpacity>
      </View>

      <SliderBox
        images={categorySliderImages}
        ImageComponentStyle={{
          width: '100%',
          height: 250,
        }}
        disableOnPress
        activeOpacity={0.6}
        autoplay={true}
        circleLoop={true}
        imageLoadingColor="#060F4C"
        dotColor="#060F4C"
      />

      <Card style={styles.cardContainer}>
        <Card.Content style={styles.mainProductContainer}>
          {mainCategory.map(item => {
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.6}
                onPress={() =>
                  navigation.navigate('subCategory', {mainCategoryId: item.id})
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

      <Title style={styles.offersTitle}>Offers and Discounts</Title>

      <SliderBox
        images={discountSliderImages}
        ImageComponentStyle={{
          width: '90%',
          height: 250,
        }}
        disableOnPress
        activeOpacity={0.6}
        autoplay={true}
        circleLoop={true}
        imageLoadingColor="#060F4C"
        dotColor="#060F4C"
      />

      <View style={styles.productsContainer}>
        {subCategory.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.productsView, {backgroundColor: Colors[index]}]}
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate('products', {
                  subCategoryId: item.id,
                  subCategoryName: item.name,
                }),
                  setSubCategoryId(item.id);
              }}>
              <LinearGradient
                colors={[Colors[index], '#FFFFFF']}
                style={styles.gradient}
                start={{x: 0, y: 0}}
                end={{x: 1.2, y: 0}}>
                <Text style={styles.productsText}>{item.name}</Text>

                <Image
                  style={styles.productImage}
                  source={{
                    uri: `${APIURL}/admin_panel/Uploads/${item.img}`,
                  }}
                />
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
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
    backgroundColor: Colors.backgroundColor,
  },
  searchContainer: {
    backgroundColor: Colors.primary,
  },
  searchInnerView: {
    margin: 10,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  searchInput: {
    paddingLeft: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: Colors.grey,
  },
  logo: {
    width: '13%',
    height: 35,
  },
  cardContainer: {
    marginVertical: 10,
    marginTop: 20,
  },
  mainProductContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  offersTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  productsContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  productsView: {
    paddingRight: 5,
    paddingVertical: 15,
    alignItems: 'flex-end',
    marginTop: 20,
  },
  productsText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    marginRight: 30,
    width: '26%',
  },
  gradient: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  productImage: {
    width: '40%',
    height: 100,
  },
  splash: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
  },
});

export default Dashboard;
