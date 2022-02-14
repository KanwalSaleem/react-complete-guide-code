import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native'
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora'
import {useSelector} from 'react-redux'
import Colors from '../../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

const CallScreen = (props) => {
  const {params} = props.route
  const BearerToken = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const [videoCall, setVideoCall] = useState(true)
  const [peerIds, setPeersId] = useState([])
  const [joinSucceed, setJoinSucceed] = useState(false)
  const appId = 'e2f44b77588d47878b33b358b68bb905'
  const [channelName, setChannelName] = useState('')
  let engine = useRef()
  const [token, setToken] = useState('')
  const callbacks = {
    EndCall: () => {
      engine.current?.leaveChannel()
      setVideoCall(false)
      setPeersId([])
      setJoinSucceed(false)
      props.navigation.navigate('reconnect', {...props.route.params})
    },
    startCall: async () => {
      console.log('heelo')

      engine.current
        ?.joinChannel(token, channelName, null, 0)
        .then((res) => console.log('video'))
      const formData = new FormData()

      formData.append('user_to_call', params.patientId)
      formData.append('channel_name', params.channel)
      formData.append('first_name', user.first_name)
      formData.append('token', params.token)

      const headers = new Headers()
      headers.append('Authorization', `Bearer ${BearerToken}`)
      fetch(`https://fabent.co.in/public/api/agora/call-user`, {
        method: 'POST',
        headers,
        body: formData,
      })
        .then(async (res) => {
          console.log(res)

          return res.json()
        })

        .catch((e) => console.log(e))
    },
  }

  const init = useCallback(async () => {
    setToken(params.token)
    setChannelName(params.channel)
    console.log(params)

    engine.current = await RtcEngine.create(appId)
    await engine.current.enableVideo()

    engine.current.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed)

      if (!peerIds.includes(uid)) {
        console.log('uid')
        setPeersId((prev) => prev.concat(uid))
      }
    })

    engine.current.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason)

      setPeersId((prev) => prev.filter((item) => uid !== item))
    })

    engine.current.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('heeelo')
        console.log('JoinChannelSuccess', channel, uid, elapsed)
        setJoinSucceed(true)
        // setChannelName(channel)
      },
    )
  }, [])

  useLayoutEffect(() => {
    props.navigation.setOptions({
      header: () => <></>,
    })
  }, [props.navigation])

  // const renderRemoteVideos = () => {
  //   return (
  //     <ScrollView
  //       style={styles.remoteContainer}
  //       contentContainerStyle={{paddingHorizontal: 2.5}}
  //       horizontal={true}>
  //       {peerIds.map((value) => (
  //         <RtcRemoteView.SurfaceView
  //           key={value}
  //           style={styles.remote}
  //           uid={value}
  //           channelId={channelName}
  //           renderMode={VideoRenderMode.Hidden}
  //           zOrderMediaOverlay={true}
  //         />
  //       ))}

  //     </ScrollView>
  //   )

  // }

  const renderRemoteVideos1 = () => {
    return joinSucceed ? (
      <View style={styles.fullView}>
        {peerIds.map((value) => (
          <RtcRemoteView.SurfaceView
            key={value}
            style={styles.max}
            uid={value}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
          />
        ))}
        {renderVideos1()}
      </View>
    ) : (
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
          // flexDirection: 'row',
        }}>
        <Text style={{color: '#fff', fontFamily: 'Roboto-Bold', fontSize: 28}}>
          Press Start Button to Call
        </Text>
      </View>
    )
  }

  // const renderVideos = () => {
  //   return joinSucceed ? (
  //     <View style={styles.fullView}>
  //       <RtcLocalView.SurfaceView
  //         style={styles.max}
  //         channelId={channelName}
  //         renderMode={VideoRenderMode.Fit}
  //       />
  //       {renderRemoteVideos()}
  //     </View>
  //   ) : null
  // }

  const renderVideos1 = () => {
    return (
      <View style={styles.remoteContainer}>
        <RtcLocalView.SurfaceView
          style={styles.remote}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
          zOrderMediaOverlay={true}
        />
      </View>
    )
  }

  useEffect(() => {
    init()
  }, [init])
  return (
    <>
      <View style={styles.max}>
        <View style={styles.max}>
          {renderRemoteVideos1()}
          <View style={styles.buttonHolder}>
            {!joinSucceed && (
              <TouchableOpacity
                onPress={callbacks.startCall}
                style={styles.button}>
                <Text style={styles.buttonText}> Start Call </Text>
              </TouchableOpacity>
            )}
            {joinSucceed && (
              <TouchableOpacity
                onPress={callbacks.EndCall}
                style={styles.endButton}>
                <Icon name="call" color={'white'} size={30} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },

  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  endButton: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.primary,
    borderRadius: 100,
  },
})

export default CallScreen
