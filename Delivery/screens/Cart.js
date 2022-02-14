import React, {useContext, useEffect, useState} from 'react'
import {
  FlatList,
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import CartItem from '../components/CartItem'
import Header from '../components/Header'
import Bottombar from '../components/BottomBar'
import colors from '../constants/colors'
import {ActivityIndicator, Modal, Portal} from 'react-native-paper'
import {useForm, Controller} from 'react-hook-form'
import {AppContext} from '../context/auth'
import ModalField from '../components/ModalField'
import LinearGradient from 'react-native-linear-gradient'
import {useHttpClient} from '../hooks/http-hook'
import numeral from 'numeral'
import {Avatar} from 'react-native-paper'

const Cart = () => {
  const [grandTotal, setGrandTotal] = useState(0)
  const {cart, addToCart, removeFromCart, user, setCart} =
    useContext(AppContext)
  const [terms, setTerms] = useState([])
  const [seller, setSeller] = useState(null)
  const [termsOpen, setTermsOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)
  const [note, setNote] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    control: milestoneControl,
    formState: {errors: milestoneErrors},
    handleSubmit: milestoneSubmit,
    reset: milestoneReset,
  } = useForm()
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: {errors, isValid},
  } = useForm()
  const {sendRequest, error, clearError, isLoading} = useHttpClient()

  const onSubmit = (data) => {
    setAddressOpen(false)
  }

  const milestoneModal = () => {
    return (
      <Portal>
        <Modal
          visible={!!seller}
          dismissable={isLoading === false}
          contentContainerStyle={styles.modalContainer}
          onDismiss={() => {
            setSeller(null)
          }}>
          <View style={styles.modalHeadingContainer}>
            <Text style={styles.modalHeading}>Request Milestone</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            {seller && <Avatar.Image source={{uri: seller?.image}} />}
            <View style={{alignItems: 'center'}}>
              {seller && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                  }}>{`${seller?.firstName} ${seller?.lastName}`}</Text>
              )}
              {seller && (
                <>
                  <Text>{`${seller.phone}`} </Text>
                  <Text>{`${seller.email}`}</Text>
                </>
              )}
            </View>
          </View>
          <Controller
            control={milestoneControl}
            name="amount"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                value={grandTotal.toString()}
                editable={false}
                onChangeText={onChange}
                placeholder="Amount"
                placeholderTextColor="grey"
                style={[
                  styles.field,
                  {color: 'black'},
                  milestoneErrors.amount && styles.redBorder,
                ]}
                keyboardType={'number-pad'}
              />
            )}
          />
          <Controller
            control={milestoneControl}
            name="detail"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Detail"
                placeholderTextColor="grey"
                style={[
                  styles.field,
                  milestoneErrors.detail && styles.redBorder,
                  {width: '80%'},
                ]}
              />
            )}
          />
          {loading ? (
            <ActivityIndicator
              color={colors.primary}
              style={{marginVertical: 20}}
            />
          ) : (
            <TouchableOpacity
              style={{width: 171, marginVertical: 20}}
              activeOpacity={0.6}
              onPress={milestoneSubmit(placeOrder)}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#2598b6', '#1BE6D6']}
                style={{
                  borderRadius: 20,
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.callToActionText}>Request Milestone</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Modal>
      </Portal>
    )
  }

  useEffect(() => {
    reset({
      name: `${user.firstName} ${user.lastName}`,
      phone: `${user.userPhone}`,
    })
    milestoneReset({
      amount: grandTotal,
    })
  }, [
    grandTotal,
    milestoneReset,
    reset,
    user.firstName,
    user.lastName,
    user.userPhone,
  ])

  const placeOrder = async (data) => {
    const {altPhone, phone, name, zip, locality, street, city, landmark} =
      getValues()

    const body = {
      amount: data.amount,
      seller,
      dscr: data.detail,
      order: {
        deliveryDetail: {
          // altPhone,
          deliveryWithin: 7,
          phone,
          name,
          // zip,
          // locality,
          // street,
          // city,
          // landmark,
        },
        products: products.map((product) => ({
          product,
          qty: product.quantity,
        })),
        // note,
      },
    }
    if (altPhone) {
      body.order.deliveryDetail.altPhone = altPhone
    }
    if (zip) {
      body.order.deliveryDetail.zip = zip
    }
    if (locality) {
      body.order.deliveryDetail.locality = locality
    }
    if (street) {
      body.order.deliveryDetail.street = street
    }
    if (city) {
      body.order.deliveryDetail.city = city
    }
    if (landmark) {
      body.order.deliveryDetail.landmark = landmark
    }
    setLoading(true)
    try {
      const response = await fetch(
        'https://deliverypay.in/api/createMilestone',
        {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message)
      }
      Alert.alert('Success', resData.message)
      console.log(cart)
      console.log(resData)
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) => item.seller._id !== resData.milestone.seller._id,
        ),
      }))
      setSeller(null)
    } catch (e) {
      Alert.alert('Error', e.message)
    }
    setLoading(false)
  }

  const addressModal = () => {
    return (
      <Portal>
        <Modal
          contentContainerStyle={styles.modalBackground}
          visible={addressOpen}
          dismissable={true}
          onDismiss={() => setAddressOpen(false)}>
          <View style={styles.modalHeadingContainer}>
            <Text style={styles.modalHeading}>Create Milestone</Text>
          </View>
          <ModalField
            control={control}
            name="name"
            rules={{required: true}}
            placeholder="Full Name"
            placeholderTextColor="grey"
            style={[styles.field, errors.name && styles.redBorder]}
          />

          <ModalField
            control={control}
            name="phone"
            rules={{required: true}}
            placeholder="Phone Number"
            placeholderTextColor="grey"
            style={[styles.field, errors.phone && styles.redBorder]}
            keyboardType={'number-pad'}
          />
          <ModalField
            control={control}
            name="zip"
            rules={{required: true}}
            placeholder="PIN Code"
            placeholderTextColor="grey"
            style={[styles.field, errors.zip && styles.redBorder]}
            keyboardType={'number-pad'}
            maxLength={6}
          />

          <ModalField
            control={control}
            name="locality"
            rules={{required: true}}
            placeholder="Locality"
            placeholderTextColor="grey"
            style={[styles.field, errors.locality && styles.redBorder]}
          />
          <ModalField
            control={control}
            name="street"
            rules={{required: true}}
            placeholder="Address"
            placeholderTextColor="grey"
            style={[styles.field, errors.street && styles.redBorder]}
          />

          <ModalField
            control={control}
            name="city"
            rules={{required: true}}
            placeholder="City"
            placeholderTextColor="grey"
            style={[styles.field, errors.city && styles.redBorder]}
          />
          <ModalField
            control={control}
            name="state"
            rules={{required: true}}
            placeholder="State"
            placeholderTextColor="grey"
            style={[styles.field, errors.state && styles.redBorder]}
          />

          <ModalField
            control={control}
            name="landmark"
            placeholder="Landmark (Optional)"
            placeholderTextColor="grey"
            style={[styles.field, errors.landmark && styles.redBorder]}
          />
          <ModalField
            control={control}
            name="altPhone"
            placeholder="Alternate Phone (Optional)"
            placeholderTextColor="grey"
            style={[styles.field, errors.altPhone && styles.redBorder]}
            keyboardType={'number-pad'}
          />

          <TouchableOpacity
            style={{width: 171, marginVertical: 20, alignSelf: 'center'}}
            activeOpacity={0.6}
            onPress={handleSubmit(onSubmit)}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#2598b6', '#1BE6D6']}
              style={{
                borderRadius: 20,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.callToActionText}>Request Milestone</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </Portal>
    )
  }

  const termsModal = () => {
    return (
      <Portal>
        <Modal
          contentContainerStyle={styles.modalBackground}
          visible={termsOpen}
          dismissable={true}
          onDismiss={() => setTermsOpen(false)}>
          <Text style={{fontSize: 14, fontFamily: 'Poppins-Regular'}}>
            {terms}
          </Text>
        </Modal>
      </Portal>
    )
  }

  return (
    <>
      {milestoneModal()}
      {addressModal()}
      {termsModal()}
      <View style={{flex: 1, height: 3000}}>
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: 'Poppins-Regular', fontSize: 20}}>
                Cart is Empty
              </Text>
            </View>
          }
          ListHeaderComponent={<Header />}
          data={cart.items}
          keyExtractor={(item) => item.seller._id}
          renderItem={({item}) => (
            <View style={{marginTop: 20}}>
              {item.products.map((product) => {
                return (
                  <CartItem
                    key={product._id}
                    quantity={product.quantity}
                    title={product.name}
                    image={product.images && product.images[0]}
                    onAdd={addToCart.bind(this, product, item.seller)}
                    onRemove={removeFromCart.bind(
                      this,
                      product._id,
                      item.seller,
                    )}
                    item={product}
                    shipping={item.seller.shopInfo.shippingCost}
                  />
                )
              })}
              <View style={styles.listFooterComponent}>
                <View style={styles.footerItem}>
                  <Text style={styles.footerText}>Total</Text>
                  <Text style={styles.footerAmount}>
                    ₹
                    {item.products
                      .map((product) => {
                        return product.sum
                      })
                      .reduce((accumulator, currentValue) =>
                        numeral(accumulator + currentValue).format('0,0'),
                      )}
                  </Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.footerText}>Delivery Pay fee 10%</Text>
                  <Text style={styles.footerAmount}>
                    ₹
                    {item.products
                      .map((product) => {
                        return product.sum
                      })
                      .reduce((accumulator, currentValue) =>
                        numeral((accumulator + currentValue) * 0.1).format(''),
                      )}
                  </Text>
                </View>

                <View style={styles.footerItem}>
                  <Text style={styles.footerText}>Grand Total</Text>
                  <Text style={styles.footerAmount}>
                    ₹
                    {item.products
                      .map((product) => {
                        return product.sum
                      })
                      .reduce((accumulator, currentValue) =>
                        numeral(
                          accumulator +
                            currentValue +
                            (accumulator + currentValue) * 0.1,
                        ).format('00,0'),
                      )}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    Refundable: Upto 24 Hours After Delivery By proceeding, I
                    agree to seller`s all{' '}
                    <Text
                      style={styles.termsText}
                      onPress={() => {
                        setTermsOpen(true)
                        setTerms(item.seller.shopInfo.terms)
                      }}>
                      Terms
                    </Text>
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.footerAmount}>Delivery Address</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setAddressOpen(true)}
                  style={{
                    marginBottom: 10,

                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  <Text style={[{alignSelf: 'flex-start'}, styles.termsText]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>Name</Text>
                  <Text style={styles.addressValue}>{watch('name')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>Phone</Text>
                  <Text style={styles.addressValue}>{watch('phone')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>Address</Text>
                  <Text style={styles.addressValue}>{watch('street')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>City</Text>
                  <Text style={styles.addressValue}>{watch('city')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>State</Text>
                  <Text style={styles.addressValue}>{watch('state')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>Zip</Text>
                  <Text style={styles.addressValue}>{watch('zip')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>Locality</Text>
                  <Text style={styles.addressValue}>{watch('locality')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>Landmark</Text>
                  <Text style={styles.addressValue}>{watch('landmark')}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.addressField}>Alternate Phone</Text>
                  <Text style={styles.addressValue}>
                    {watch('alternatePhone')}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.footerAmount}>Note To Seller</Text>
                  <TextInput
                    multiline={true}
                    style={styles.noteField}
                    value={note}
                    onChangeText={(text) => setNote(text)}
                  />
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      setSeller(item.seller)
                      setProducts(item.products)
                      setGrandTotal(
                        item.products
                          .map((product) => {
                            return product.sum
                          })
                          .reduce((accumulator, currentValue) =>
                            numeral(
                              accumulator +
                                currentValue +
                                (accumulator + currentValue) * 0.1,
                            ).format('00,0'),
                          ),
                      )
                    }}
                    style={{
                      backgroundColor: colors.purple,
                      alignSelf: 'center',
                      marginTop: 10,
                      padding: 10,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Poppins-Regaular',
                        fontSize: 18,
                      }}>
                      Place Order
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <Bottombar />
    </>
  )
}

const styles = StyleSheet.create({
  listFooterComponent: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    // alignItems: 'center',
    elevation: 6,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  footerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
  footerAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  termsText: {
    fontSize: 18,
    color: colors.purple,
    textDecorationLine: 'underline',
  },
  modalHeadingContainer: {
    borderBottomColor: '#aaa',
    borderBottomWidth: 2,
    width: '100%',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  modalBackground: {
    backgroundColor: 'white',
    // alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 20,
  },
  field: {
    borderBottomWidth: 2,
    fontSize: 16,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
    // alignItems: 'center',
    borderBottomColor: '#cccc',
    marginTop: 10,
  },
  redBorder: {
    borderBottomColor: '#c12323',
  },
  callToActionText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
    alignSelf: 'center',
  },
  addressField: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  addressValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  noteField: {
    borderRadius: 10,
    borderWidth: 0.5,
    height: 100,
    textAlignVertical: 'center',
  },
})

export default Cart
