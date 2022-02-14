import React, {useState, useRef} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'

import Video from 'react-native-video'
import Colors from '../../constants/Colors'

const HowToVerify = () => {
  const [loading, setLoading] = useState(false)
  const player = useRef()

  return (
    <View style={styles.screen}>
      {loading && (
        // <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator color={Colors.primary} size={'large'} />
        // </View>
      )}
      <Video
        source={{
          uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        ref={(ref) => {
          player.current = ref
        }}
        style={[styles.backgroundVideo, {display: loading ? 'none' : 'flex'}]}
        controls={true}
        resizeMode={'cover'}
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
        onBuffer={(e) => console.log(e, 'heelo')}
        onVideoBuffer={(e) => console.log(e, 'video')}
        onLoad={(e) => setLoading(false)}
        onLoadStart={(e) => {
          setLoading(true)
        }}
        poster={`https://www.meditatecenter.com/howtomeditate/wp-content/uploads/2015/02/video-placeholder.jpg`}
        posterResizeMode="cover"
      />
    </View>
  )
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    // justifyContent: 'center',
  },
  backgroundVideo: {
    // position: 'absolute',

    zIndex: 1,
    marginTop: 10,
    borderRadius: 10,
    // left: 0,
    // bottom: 0,
    // right: 0,
    width: '100%',
    height: 220,
    borderWidth: 0.5,
  },
})

export default HowToVerify
