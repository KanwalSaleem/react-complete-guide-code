import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors';
import ProductComp from '../components/ProductComp';
import {useFocusEffect} from '@react-navigation/core';
import {APIURL} from '../constants/Url';

const Search = () => {
  const [searchProduct, setSearchProduct] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getAllProducts = useCallback(async () => {
    setSearchData([]);
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/getallproducts.php`;
      let form = new FormData();
      form.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: form,
      });

      const responseData = await response.json();
      const Success = responseData?.success;

      if (Success === false) {
        throw new Error(responseData.message);
      } else {
        const productDetails = responseData.Data;
        const productItem = [];

        productDetails.forEach(item => {
          productItem.push({
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
          });
        });
        setSearchData(productItem);

        setAllProducts(productItem);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllProducts();
      return () => setSearchProduct('');
    }, []),
  );

  const setProducts = text => {
    setSearchProduct(text);
    if (text) {
      setAllProducts(
        allProducts.filter(item =>
          item.name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    } else {
      setAllProducts(searchData);
    }
  };

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.screen}>
        <View style={styles.mainContainer}>
          <View style={styles.searchConatiner}>
            <Text style={styles.searchTitle}>
              Search Vegetables, Fruits etc
            </Text>
            <View style={styles.searchArea}>
              <TextInput
                placeholder="Search..."
                value={searchProduct}
                // name="search"
                style={styles.searchInput}
                onChangeText={setProducts}
                multiline={true}
              />
            </View>
          </View>

          {searchProduct != '' && (
            <View style={styles.productConatiner}>
              <FlatList
                data={allProducts}
                keyExtractor={(item, index) => item.id}
                renderItem={({item}) => {
                  return <ProductComp {...item} />;
                }}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  mainContainer: {
    marginTop: 20,
  },
  searchConatiner: {
    marginHorizontal: 20,
  },
  searchTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
  },
  searchArea: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
  },
  searchInput: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    paddingHorizontal: 10,
  },
  productConatiner: {
    marginTop: 30,
    marginHorizontal: 10,
    height: '80%',
    marginVertical: 20,
  },
});

export default Search;
