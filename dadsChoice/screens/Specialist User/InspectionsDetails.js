import React, {useEffect, useState, useCallback} from 'react'
import {View, StyleSheet, Text, Image, ScrollView, FlatList} from 'react-native'
import {useSelector} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import fetch from 'node-fetch'
import {APIURL} from '../../constants/url'

const InspectionsDetails = ({route, navigation}) => {
  const {params} = route
  const {vehicleInformation, vehiclePhoto, vehiclePhotoCG} = useSelector(
    (state) => state.language,
  )
  const token = useSelector((state) => state.auth.token)
  const [detail, setDetail] = useState()
  const [images, setImages] = useState([])
  const [cgImages, setCgImages] = useState([])

  const fetchDetail = useCallback(
    async () => {
      // eslint-disable-next-line no-undef
      const headers = new Headers()

      headers.append('Accept', 'application/json')

      headers.append('Authorization', `Bearer ${token}`)

      const requestOptions = {
        method: 'GET',
        headers,
        //   redirect: 'follow',
      }

      try {
        // setLoading(tr)
        const response = await fetch(
          `${APIURL}/api/inspection/${params.id}`,
          requestOptions,
        )
        console.log(response)
        const resData = await response.json()
        // const textData = await resData.
        console.log(resData)

        // eslint-disable-next-line no-undef

        if (!response.ok) {
          throw new Error(resData.message)
        }
        setDetail(resData.data[0])
        const parsedImages = JSON.parse(resData.data[0].vehicle_img)
        const validImages = parsedImages.map((image) => ({
          name: image,
        }))
        console.log(validImages)
        setImages(validImages)
        const parsedCgImages = JSON.parse(resData.data[0].vehicle_cg_img)
        const validCgImages = parsedCgImages.map((image) => ({
          name: image,
        }))
        setCgImages(validCgImages)
        console.log(resData.data[0], 'resData')

        // setDetail(resData.data[0].content)
      } catch (e) {
        console.log(e)
      }
    },
    [params.id, token],
  )

  useEffect(
    () => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Screen was focused
        // Do something
        fetchDetail()
      })

      return unsubscribe
    },
    [fetchDetail, navigation],
  )

  return (
    <View style={{flex: 1, paddingTop: 10, paddingHorizontal: 5}}>
      <View style={styles.time}>
        <Icon name="event" size={22} color="grey" />
        <Text style={styles.datetext}>{detail?.date_of_mission}</Text>
        <View style={styles.timeicon}>
          <Icon name="schedule" size={22} color="grey" />
          <Text style={styles.datetext}>{detail?.time_slot}</Text>
        </View>
      </View>
      <View style={styles.text}>
        <Text style={styles.heading}>{vehicleInformation}</Text>
        <Text>{detail?.vehicle_announcement} </Text>
      </View>
      {/* <View> */}
      <View style={styles.item}>
        <Text style={styles.title}>{vehiclePhoto}</Text>
        <View style={styles.imageview}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: 'space-around',
            }}
            data={images}
            renderItem={(itemData) => (
              <Image
                source={{
                  uri: `${APIURL}/uploads/vehicles/${itemData.item.name}`,
                }}
                style={styles.image}
              />
            )}
            keyExtractor={(item) => item.name}
          />
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.title}>{vehiclePhotoCG}</Text>
        <View style={styles.imageview}>
          {/* <Image
              style={styles.image}
              source={require('../../assets/images/car.jpg')}
            />
            <Image
              style={styles.image}
              source={require('../../assets/images/car.jpg')}
            />
            <Image
              style={styles.image}
              source={require('../../assets/images/car.jpg')}
            /> */}

          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={cgImages}
            renderItem={(itemData) => (
              <Image
                source={{
                  uri: `${APIURL}/uploads/vehicles/cg/${itemData.item.name}`,
                }}
                style={styles.image}
              />
            )}
            keyExtractor={(item) => item.name}
          />
        </View>
      </View>
      {/* </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //   flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },

  datetext: {
    marginLeft: 4,
    color: 'grey',
    fontSize: 18,
  },
  timeicon: {
    marginLeft: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    marginBottom: 5,
  },
  text: {
    //    width: '100%',
    fontSize: 18,
    marginTop: 20,
    paddingHorizontal: 5,
  },
  item: {
    marginTop: 25,
  },
  title: {
    color: 'grey',
    fontSize: 20,
  },
  imageview: {
    // flexDirection: 'row',

    marginTop: 10,
  },

  image: {
    width: 150,
    height: 150,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'black',
  },
})
export default InspectionsDetails
