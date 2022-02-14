import React, {useCallback, useState} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import {APIURL} from '../constants/Url';
const SubCategory = ({route, navigation}) => {
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

  const {mainCategoryId} = route.params;

  const [subCategory, setSubCategory] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getSubCategories = useCallback(async () => {
    console.log('alkjsdlkaj');
    setLoading(true);
    setSubCategory([]);
    try {
      let base_url = `${APIURL}/API/sub_categories.php`;

      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      uploadData.append('main_category_id', mainCategoryId);

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
    }
    setLoading(false);
  }, [mainCategoryId]);

  useFocusEffect(
    useCallback(() => {
      getSubCategories();
    }, [getSubCategories]),
  );

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color="#060F4C" />
    </View>
  ) : (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {subCategory.length === 0 && (
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 'auto',
            }}>
            <Text style={{fontSize: 22, fontFamily: 'OpenSans-Bold'}}>
              No Products Available
            </Text>
          </View>
        )}
        {subCategory.length > 0 && (
          <View style={styles.productsContainer}>
            {subCategory.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.productsView,
                    {backgroundColor: Colors[index]},
                  ]}
                  activeOpacity={0.6}
                  onPress={() => {
                    navigation.navigate('products', {
                      subCategoryId: item.id,
                      subCategoryName: item.name,
                    });
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
        )}
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
    height: 70,
  },
});

export default SubCategory;
