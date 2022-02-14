import React, {useCallback, useContext, useEffect, useState} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native'

import {useHttpClient} from '../../hooks/http-hook'
import Header from '../../components/Header'
import BottomBar from '../../components/BottomBar'
import {SwiperFlatList} from 'react-native-swiper-flatlist'
import colors from '../../constants/colors'
import {AppContext} from '../../context/auth'
import {useFocusEffect} from '@react-navigation/native'

const SingleProduct = (props) => {
  const {sendRequest, error, clearError, isLoading} = useHttpClient()
  const window = useWindowDimensions()
  const [product, setProduct] = useState({})
  const {addToCart} = useContext(AppContext)

  useFocusEffect(
    useCallback(() => {
      const getProduct = async () => {
        const response = await sendRequest(
          `https://deliverypay.in/api/singleProduct?_id=${props.route.params.id}`,
        )
        setProduct(response.product)
        console.log(response)
      }
      getProduct()
    }, [props.route.params.id, sendRequest]),
  )

  return (
    <>
      <Header />
      <View style={styles.screen}>
        <SwiperFlatList
          style={{flex: 1}}
          autoplay
          autoplayDelay={2}
          autoplayLoop
          index={0}
          showPagination
          data={product.images}
          renderItem={({item}) => (
            <Image source={{uri: item}} style={{width: window.width}} />
          )}
        />
      </View>

      <View style={styles.detail}>
        {product && <Text style={styles.title}>{product.name}</Text>}
        {product && <Text style={styles.description}>{product.dscr}</Text>}
        {product && (
          <Text style={styles.price}>
            Available :{' '}
            <Text style={{fontFamily: 'Poppins'}}>{product.price}</Text>
          </Text>
        )}
        {product && (
          <Text style={styles.price}>Price: ₹{product.available}</Text>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            disable={true}
            activeOpacity={0.6}
            style={styles.cartButton}
            onPress={addToCart.bind(this, product, product.user)}>
            <Text style={styles.cardButtonText}>Add To Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cardButtonText}>Share the Product</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.price}>{product.}</Text> */}
        {product.user && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              minWidth: '80%',
            }}>
            {product && <Text style={styles.shopDetail}> Being Sold By: </Text>}
            <Image
              source={{uri: product.user.shopInfo.logo}}
              style={{width: 40, height: 40}}
            />
            {product && (
              <Text style={styles.shopDetail}>
                {product?.user.shopInfo.name}
              </Text>
            )}
          </View>
        )}
      </View>
      {/* <Image source={{uri: product.}} /> */}
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
  },

  detail: {
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    marginTop: 10,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
  },
  price: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cartButton: {
    backgroundColor: colors.purple,
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cardButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  shopDetail: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
})

export default SingleProduct
