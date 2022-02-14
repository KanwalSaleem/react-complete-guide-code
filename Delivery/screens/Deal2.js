import React from 'react'
import Header from '../components/Header'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native'
import {rosybrown} from 'color-name'
import CommonSearch from '../components/CommonSearch'
import BottomBar from '../components/BottomBar'

const Data = [
  {
    id: '1',
    image: require('../assets/profile.jpg'),
    name: 'Teja Puri',
    phoneNumber: '+9187725777',
    email: 'tejap@gmail.com',
    address: 'Mumbai India',
    chartStatus: '',
  },
  {
    id: '2',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    phoneNumber: '+9187725777',
    email: 'tejap@gmail.com',
    address: 'Mumbai India',
    chartStatus: '4',
  },
  {
    id: '3',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    phoneNumber: '+9187725777',
    email: 'tejap@gmail.com',
    address: 'Mumbai India',
    chartStatus: '3',
  },
  {
    id: '4',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    phoneNumber: '+9187725777',
    email: 'tejap@gmail.com',
    address: 'Mumbai India',
    chartStatus: '2',
  },
  {
    id: '5',
    image: require('../assets/profile.jpg'),
    name: 'Teja Pujari',
    phoneNumber: '+9187725777',
    email: 'tejap@gmail.com',
    address: 'Mumbai India',
    chartStatus: '2',
  },
]

const Deal2 = () => {
  const window = useWindowDimensions()
  return (
    <>
      <Header />
      <View>
        <View style={styles.titleView}>
          <Text style={styles.title}>Start a Chart</Text>
          <Image
            style={styles.tileImage}
            source={require('../assets/icons/arrow.png')}
          />
        </View>
        <View style={styles.searchBarView}>
          <CommonSearch
            placeholder={'Search with Skropay ID or Phone Number'}
          />
        </View>
        <View
          style={{
            height: window.height < 700 ? 182 : 360,
            // marginBottom: 10,
            // marginTop: 30,
            // paddingBottom: 10,
            // top: -10,
            paddingHorizontal: 10,
            // marginTop: 10,
            paddingTop: 20,
          }}>
          <FlatList
            // style={{marginBottom: 10}}
            data={Data}
            keyExtractor={(item, index) => item.id}
            //   numColumns={3}
            renderItem={({item}) => {
              // console.log(item)
              // console.log(item.chartStatus)
              return (
                // <View style={styles.list}>
                <View
                  style={
                    item.chartStatus == ''
                      ? styles.pinkInnerList
                      : styles.innerList
                  }>
                  <View style={styles.imageView}>
                    <Image style={styles.image} source={item.image} />
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.address}>{item.address}</Text>
                  </View>

                  {item.chartStatus == '' ? (
                    <Text>{item.chartStatus}</Text>
                  ) : (
                    <View style={styles.chartStatusView}>
                      <Text style={styles.chartStatus}>{item.chartStatus}</Text>
                    </View>
                  )}
                </View>
                // </View>
              )
            }}
          />
        </View>
      </View>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#336CF9',
    fontFamily: 'Poppins-Regular',
  },
  titleImage: {},

  searchBarView: {
    paddingLeft: 10,
  },

  innerList: {
    // backgroundColor: '#F9EAF4',
    // color: '#F9EAF4',
    flex: 1,
    flexDirection: 'row',
    // alignContent: 'space-around',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    // paddingTop: 30,
    // paddingLeft: 10,
    paddingVertical: 10,
    // paddingBottom: 20,
    borderRadius: 15,
    // paddingTop: 10,
    marginTop: 10,
  },
  pinkInnerList: {
    backgroundColor: '#F9EAF4',
    // color: '#F9EAF4',
    flex: 1,
    flexDirection: 'row',
    // alignContent: 'space-around',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    // alignSelf: 'center',
    // paddingTop: 30,
    // paddingLeft: 10,
    paddingVertical: 10,
    // paddingBottom: 20,
    borderRadius: 15,
    // paddingTop: 10,
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  details: {
    paddingLeft: 10,
    // paddingRight: 40,
  },
  name: {
    fontSize: 15,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#2A2A2A',
    fontFamily: 'Poppins-Regular',
  },
  email: {
    fontSize: 14,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  address: {
    fontSize: 14,
    color: '#707070',
    fontFamily: 'Poppins-Regular',
  },
  chartStatusView: {
    // paddingRight: 20,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingLeft: 40,
  },
  chartStatus: {
    // color: '#707070',
    fontSize: 18,
    // borderColor: '#5ab1fc',
    // borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'center',
    backgroundColor: '#F95B5B',
    color: '#F8FAFF',
    borderColor: '#707070',
    // alignSelf: 'center',
  },
})

export default Deal2
