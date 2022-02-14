import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import {useFocusEffect} from '@react-navigation/native';
import ProductComp from '../components/ProductComp';
import {APIURL} from '../constants/Url';

const Products = ({route, navigation}) => {
  console.log('hello 1234567890');
  const {subCategoryId, subCategoryName} = route.params;

  const [isLoading, setLoading] = useState(false);
  const [ProductData, setProductData] = useState([]);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setProductData([]);
    try {
      let base_url = `${APIURL}/API/get_products_by_category.php`;
      // eslint-disable-next-line no-undef

      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      uploadData.append('category_id', subCategoryId);
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });
      const responseData = await response.json();

      if (responseData.status === false) {
        // setProductData(null);
        // throw new Error(responseData.Message);
      } else {
        const productDetails = responseData.Data;
        const productItem = productDetails.map(item => ({
          name: item.name,
          description: item.description,
          actualPrice: parseFloat(item.price).toFixed(2),
          price: parseFloat(
            (
              parseFloat(item.price) -
              parseFloat(item.price) * (parseFloat(item.discount) / 100)
            ).toFixed(2),
          ),

          id: parseInt(item.id),
          quantity: 0,
          sum: 0,
          discount: parseInt(item.discount) + ' %off',
          qty: item.qty,
          image: item.img,
          sub_category_id: item.sub_category_id,
        }));
        console.log(responseData);

        console.log(productItem);
        setProductData(productItem);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, [subCategoryId]);

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [fetchProduct]),
  );

  return (
    <View style={styles.screen}>
      <View style={styles.productTitleContainer}>
        <Text style={styles.productTitle}>{subCategoryName.toUpperCase()}</Text>
      </View>

      <View>
        <View style={styles.productConatiner}>
          {isLoading ? (
            <View style={styles.activity}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <FlatList
              data={ProductData}
              keyExtractor={(item, index) => item.id}
              ListEmptyComponent={
                <View style={styles.noProductContainer}>
                  <Text style={styles.noProduct}>No Products</Text>
                </View>
              }
              renderItem={({item}) => {
                return (
                  <View style={styles.productInnerContainer}>
                    <ProductComp {...item} />
                  </View>
                );
              }}
            />
          )}
        </View>

        <AuthButton
          style={styles.button}
          onPress={() => navigation.navigate('cart')}>
          Go to Cart
        </AuthButton>
      </View>
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
  productTitleContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: Colors.backgroundColor,
  },

  productConatiner: {
    marginTop: 30,
    marginHorizontal: 10,
    height: '80%',
    marginVertical: 20,
  },

  button: {
    // marginBottom: 20,
    backgroundColor: Colors.secondary,
  },
  noProduct: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
  },
  noProductContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Products;
