import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'

const ProductServiceItem = (props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={props.onPress}>
      <ScrollView showsHorizontalScrollIndicator={true}>
        <View style={styles.subContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemHeading}>Image</Text>
            <Image
              source={{uri: props.image}}
              style={{width: 80, height: 80, borderRadius: 10}}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemHeading}>Date</Text>
            <Text style={styles.itemText}>{props.date}</Text>
          </View>

          <View style={styles.itemContainer}>
            <Text style={styles.itemHeading}>Name</Text>
            <Text style={styles.itemText}>{props.name}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemHeading}>Type</Text>
            <Text style={styles.itemText}>{props.type}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemHeading}>Fb MarketPlace</Text>
            <Text style={styles.itemText}>
              {props.fbMarketId ? 'Added' : 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemHeading}>Available</Text>
            {props.available && (
              <Text style={styles.itemText}>{props.available}</Text>
            )}
          </View>
          <View>
            <Text style={styles.itemHeading}>Price</Text>
            <Text style={styles.itemText}>₹{props.price}</Text>
          </View>

          <View>
            <Text style={styles.itemHeading}>GST</Text>
            <Text style={styles.itemText}>{props.gst ? props.gst : 'N/A'}</Text>
          </View>
          <View>
            <Text style={styles.itemHeading}>Discount</Text>
            {props.discount && (
              <Text style={styles.itemText}>₹{props.discount.amount}</Text>
            )}
          </View>
          <View>
            <Text style={styles.itemHeading}>Listing Price</Text>
            {props.discount && (
              <Text style={styles.itemText}>
                ₹{props.price - props.discount.amount}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 5,
    elevation: 6,
    borderRadius: 5,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 10,
  },
  itemHeading: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  itemText: {
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginRight: 5,
  },
})

export default ProductServiceItem
