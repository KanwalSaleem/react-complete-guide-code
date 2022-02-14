import React, {useCallback, useEffect, useState, useContext} from 'react'
import {View, Text, FlatList, useWindowDimensions, Alert} from 'react-native'
import CommonSearch from '../../components/CommonSearch'
import Header from '../../components/Header'
import BottomBar from '../../components/BottomBar'
import {useHttpClient} from '../../hooks/http-hook'
import ProductItem from '../../components/ProductItem'
import {AppContext} from '../../context/auth'

const ProductList = ({navigation, route}) => {
  const {addToCart} = useContext(AppContext)

  const window = useWindowDimensions()
  const {query, setQuery} = useState('')
  const {sendRequest, isLoading, error, clearError} = useHttpClient()
  const [products, setProducts] = useState({
    products: [],
    seller: {},
  })

  const getProducts = useCallback(async () => {
    try {
      const response = await sendRequest(
        `https://deliverypay.in/api/getProducts?seller=${route.params.id}`,
      )

      if (error) {
        return Alert.alert('Error', response.message, [
          {onPress: () => clearError},
        ])
      }
      setProducts({
        products: response.products,
        seller: response.seller,
      })
      console.log(response)
    } catch (e) {
      e
    }
  }, [route.params.id, sendRequest])

  const goToProduct = (id) =>
    navigation.navigate('singleProduct', {
      id,
    })

  useEffect(() => {
    getProducts().then(() => console.log(products))
  }, [getProducts])

  return (
    <>
      <Header />

      <FlatList
        ListEmptyComponent={
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, fontFamily: 'Poppins-Regular'}}>
              There are no Products for this Shop.
            </Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyExtractor={(item) => item._id}
        data={products.products}
        renderItem={({item}) => (
          <ProductItem
            name={item.name}
            uri={item.images[0]}
            price={item.price}
            onCartPress={addToCart.bind(this, item, products.seller)}
            onPress={goToProduct.bind(this, item._id)}
          />
        )}
        ListHeaderComponent={
          <>
            <CommonSearch />
          </>
        }
      />
      <BottomBar />
    </>
  )
}

export default ProductList
