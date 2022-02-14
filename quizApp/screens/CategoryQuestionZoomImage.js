import React from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'

import ImageViewer from 'react-native-image-zoom-viewer'

const ZoomImage = ({route, navigation}) => {
  const {image1, image2, image3, image4, image5} = route.params

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <ImageViewer
          imageUrls={[
            {
              url: 'https://worldmcqs.org/Admin/assets/Images/' + image1,
            },
            {
              url: 'https://worldmcqs.org/Admin/assets/Images/' + image2,
            },
            {
              url: 'https://worldmcqs.org/Admin/assets/Images/' + image3,
            },
            {
              url: 'https://worldmcqs.org/Admin/assets/Images/' + image4,
            },
            {
              url: 'https://worldmcqs.org/Admin/assets/Images/' + image5,
            },
          ]}
          renderIndicator={() => null}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
})

export default ZoomImage
