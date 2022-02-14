import React, {useEffect, useRef, useState, useContext} from 'react'
import Header from '../components/Header'
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from 'react-native'

import CommonSearch from '../components/CommonSearch'
import BottomBar from '../components/BottomBar'

const Deal = (props) => {
  const {socket, rooms, setRooms} = props

  // const [rooms, setRooms] = useState([])
  // const socket = io('https://deliverypay.in', {
  //   extraHeaders: {
  //     test: '1',
  //     cookie:
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkZWxpdmVyeVBheSIsInN1YiI6IjYxMDJkMzM5MTBlODI2NjUzZDAzNmE3NCIsImlhdCI6MTYzMTE5NzgzOX0.9y9-99DRkko8ZGmy-OEIf_JW-f1S_1KoizXQul8EUus',
  //   },
  // })
  // socket.connect()
  // console.log(socket.id)
  // socket.connect()
  // useEffect(() => {
  // socket.on('connect', (response) => console.log(response, 'connect'))
  //   //socket.on('test', (r) => console.log(socket.id, 'test'))
  //   socket.on('connectedToRoom', (r) => setRooms(r))
  //   socket.emit('joinRooms', {rooms})
  //   socket.emit('initiateChat', {client_id: '610532208a12c6447ed42e4c'}, (y) =>
  //     console.log(y, 'initiateChat'),
  //   )
  //   socket.on('messageToUser', (response) =>
  //     console.log(response, 'messageToUser'),
  //   )
  //   socket.on('newChat', (payload) => console.log(payload, 'newChat'))
  // }, [])

  // socket.onC

  const [chats, setChats] = useState([])

  const [users, setUsers] = useState([])
  const window = useWindowDimensions()

  const getUsers = async (text) => {
    if (text === '') {
      setUsers([])
    }
    try {
      // if (chats.length === 0) {
      const response = await fetch(
        `https://deliverypay.in/api/getUsers?q=${text}`,
      )
      const resData = await response.json()

      const validArray = resData.map((user) => ({
        clientId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        image: user.profileImg,
      }))
      // console.log(resData)

      setUsers(validArray)

      console.log(validArray)
      // }
      // console.log(response)
      // const response = await sendRequest('https://deliverypay.in/api/getChat')
      //socket.on('connect', () => console.log(socket.id, 'socketId'))

      //socket.on('test', (r) => console.log(socket.id, 'test'))

      // socket.on('connectedToRoom', (r) => {
      //   console.log(r)
      //   setRooms(r.rooms.map((room) => room))
      // })

      // socket.emit(
      //   'initiateChat',
      //   {client_id: '60fee8603435a87f6a609ec6'},
      //   (y) => console.log(y, 'initiateChat'),
      // )

      // socket.on('messageToUser', (response) =>
      //   console.log(response, 'messageToUserfrom deal'),
      // )

      // socket.on('newChat', (payload) => console.log(payload, 'newChat'))
    } catch (e) {
      Alert.alert('Error', e.message)
    }
  }

  socket.on('disconnect', () => console.log('disconnected'))
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      try {
        const response = await fetch('https://deliverypay.in/api/getChat', {})
        const resData = await response.json()
        socket.emit('joinRooms', {
          rooms: resData.map((contact) => contact._id),
        })
        // console.log(`rooms:[${resData.map((contact) => contact._id)}]`, 'rooms')
        const validArray = resData.map((chat) => ({
          id: chat._id,
          firstName: chat.client.firstName,
          lastName: chat.client.lastName,
          email: chat.client.email,
          phone: chat.client.phone,
          image: chat.client.profileImg,
          clientId: chat.client._id,
          messages: chat.messages,
          client: chat.client,
        }))
        console.log(resData)

        setChats(validArray)

        socket.on('connectedToRoom', (r) => {
          console.log(r)
          setRooms(r.rooms.map((room) => room))
        })
      } catch (e) {
        Alert.alert('Error', e.message)
      }
    })

    return unsubscribe
  }, [props.navigation, setRooms, socket])
  return (
    <>
      <Header />
      <View>
        <View style={styles.titleView}>
          <Text style={styles.title}>Start a Chat</Text>
          <Image
            style={styles.tileImage}
            source={require('../assets/icons/arrow.png')}
          />
        </View>
        <View style={styles.searchBarView}>
          <CommonSearch onChangeText={getUsers} placeholder={'Phone Number'} />
        </View>
        <View
          style={{
            height:
              window.height < 700 ? window.height - 373 : window.height - 370,
            paddingTop: 10,
            paddingHorizontal: 10,
          }}
          // style={{
          //   height:
          //     window.height < 700
          //       ? window.width < 400
          //         ? '48%'
          //         : '56%'
          //       : window.width < 400
          //       ? 355
          //       : 385,
          //   paddingTop: 10,
          //   paddingHorizontal: 10,
          // }}
        >
          {users.length === 0 && (
            <FlatList
              data={chats}
              keyExtractor={(item, index) => item.clientId}
              renderItem={({item}) => {
                // console.log(item)
                return (
                  // <View style={styles.list}>
                  <View style={[styles.innerList, {backgroundColor: 'white'}]}>
                    <View style={styles.imageView}>
                      <Image
                        style={styles.image}
                        source={{
                          uri:
                            item.image ||
                            'https://www.mountsinai.on.ca/wellbeing/our-team/team-images/person-placeholder/image_view_fullscreen',
                        }}
                      />
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.name}>{item.firstName}</Text>
                      <Text style={styles.name}>{item.lastName}</Text>
                      <Text style={styles.phoneNumber}>{item.phone}</Text>
                      <Text style={styles.email}>{item.email}</Text>
                      <Text style={styles.address}>{item.address}</Text>
                    </View>
                    <View style={styles.requestStatusView}>
                      <Text style={styles.requestStatus}>
                        {item.requestStatus}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.chartStatusView}
                      onPress={() => {
                        // console.log(rooms)
                        // socket.emit('messageToServer', {
                        //   rooms,
                        //   message: {
                        //     text: 'hello',
                        //     to: '60fee8603435a87f6a609ec6',
                        //   },
                        // })

                        // socket.on('messageToUser', (response) =>
                        //   console.log(response, 'messageToUser'),
                        // )

                        props.navigation.navigate('chat', {
                          rooms,
                          email: item.email,
                          name: `${item.firstName} ${item.lastName}`,
                          clientId: item.clientId,
                          phone: item.phone,
                          image: item.image,
                          seller: item.client,
                          messages: item.messages,
                        })
                      }}>
                      <Text style={styles.chartStatus}>Chat</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    onPress={() =>
                      
                    }>
                    <Text>hello</Text>
                  </TouchableOpacity> */}
                  </View>
                  // </View>
                )
              }}
            />
          )}

          {/* {Search Users List} */}
          <FlatList
            data={users}
            key={(item) => item.key}
            renderItem={({item}) => {
              return (
                // <View style={styles.list}>
                <TouchableOpacity style={styles.innerList}>
                  <View style={styles.imageView}>
                    <Image
                      style={styles.image}
                      source={{
                        uri:
                          item.image ||
                          'https://www.mountsinai.on.ca/wellbeing/our-team/team-images/person-placeholder/image_view_fullscreen',
                      }}
                    />
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.name}>{item.firstName}</Text>
                    <Text style={styles.name}>{item.lastName}</Text>
                    <Text style={styles.phoneNumber}>{item.phone}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.address}>{item.address}</Text>
                  </View>
                  <View style={styles.requestStatusView}>
                    <Text style={styles.requestStatus}>
                      {item.requestStatus}
                    </Text>
                  </View>
                  {/* <TouchableOpacity
                    style={styles.chartStatusView}
                    onPress={() => {
                      console.log(rooms)
                      // socket.emit('messageToServer', {
                      //   rooms,
                      //   message: {
                      //     text: 'hello',
                      //     to: '60fee8603435a87f6a609ec6',
                      //   },
                      // })

                      // socket.on('messageToUser', (response) =>
                      //   console.log(response, 'messageToUser'),
                      // )

                      props.navigation.navigate('chat', {
                        rooms,
                        email: item.email,
                        name: `${item.firstName}`,
                        clientId: item.clientId,

                        messages: item.messages,
                      })
                    }}>
                    <Text style={styles.chartStatus}>Chat</Text>
                  </TouchableOpacity> */}
                  {/* <TouchableOpacity
                  onPress={() =>
                    
                  }>
                  <Text>hello</Text>
                </TouchableOpacity> */}
                </TouchableOpacity>
                // </View>
              )
            }}
          />
        </View>
        <BottomBar />
      </View>
      {/* <View style={{bottom: 0}}> */}
      {/* </View> */}
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
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-around',
    // justifyContent: 'flex-start',
    justifyContent: 'space-around',
    alignItems: 'center',
    // paddingTop: 30,
    paddingVertical: 10,
    paddingLeft: 20,
    marginTop: 10,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  details: {
    paddingLeft: 40,
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
  requestStatusView: {
    paddingBottom: 50,
    paddingRight: 40,
  },
  requestStatus: {
    fontSize: 11,
    color: '#707070',
  },
  chartStatusView: {
    paddingRight: 20,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  chartStatus: {
    color: '#707070',
    fontSize: 11,
    borderColor: '#5ab1fc',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    fontFamily: 'Poppins-Regular',
  },
})

export default Deal
