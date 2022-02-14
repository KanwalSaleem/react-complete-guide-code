import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../Constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';

const Description = ({params}) => {
  const player = useRef();
  const [loading, setLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  console.log(params.expertVideo);
  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.videoContainer}>
          {!playVideo ? (
            <TouchableOpacity
              style={styles.videoLoaderContainer}
              activeOpacity={0.6}
              onPress={() => setPlayVideo(true)}>
              <Icon name="play-arrow" size={35} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <>
              {loading && <ActivityIndicator color="#DADADACC" size={70} />}

              <Video
                source={{
                  uri: params.expertVideo.exp_public_path,
                }}
                ref={ref => {
                  player.current = ref;
                }}
                style={[
                  styles.backgroundVideo,
                  {
                    display: loading ? 'none' : 'flex',
                    height: 242,
                    width: '100%',
                  },
                ]}
                controls={true}
                resizeMode={'cover'}
                bufferConfig={{
                  minBufferMs: 15000,
                  maxBufferMs: 50000,
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 5000,
                }}
                onBuffer={e => console.log(e, 'heelo')}
                onVideoBuffer={e => console.log(e, 'video')}
                onLoad={e => setLoading(false)}
                onLoadStart={e => {
                  setLoading(true);
                }}
                posterResizeMode="cover"
                onError={() => console.log('error')}
              />
            </>
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.TitleConainer}>
            <Text style={[styles.title, {fontSize: 12}]}>{'\u25CF'}</Text>
            <Text style={[styles.title, {color: Colors.white}]}>
              Expert Video
            </Text>
            <Text style={styles.title}>
              {params.expertVideo.exp_video_name}
            </Text>
          </View>

          <View style={styles.TitleConainer}>
            {params.athleteName && (
              <>
                <Text style={[styles.title, {fontSize: 12}]}>{'\u25CF'}</Text>
                <Text style={[styles.title, {color: Colors.white}]}>
                  Athlete
                </Text>
                <Text style={styles.title}>{params.athleteName.label}</Text>
              </>
            )}
          </View>
          <View style={styles.TitleConainer}>
            {/* <Text style={[styles.date, {fontStyle: 'italic'}]}>timestamp </Text>
            <Text style={styles.date}>19</Text>
            <Text style={[styles.date, {color: Colors.primary}]}>Nov</Text> */}
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}></Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '97%',
    marginTop: 15,
  },
  videoContainer: {
    height: 242,
    justifyContent: 'center',
    backgroundColor: '#770000',
    borderRadius: 10,
  },
  videoLoaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DADADACC',
    width: 57,
    height: 57,
    borderRadius: 57,
    alignSelf: 'center',
  },
  infoContainer: {},
  TitleConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.primary,
    paddingHorizontal: 5,
  },
  date: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#B3B3B6',
    paddingHorizontal: 5,
  },
  descriptionContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#C8C8CA',
    textAlignVertical: 'center',
  },
});

export default Description;
