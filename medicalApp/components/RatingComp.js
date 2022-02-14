import React from 'react'
import SwipeableRating from 'react-native-swipeable-rating'

const RatingComp = (props) => {
  return (
    <SwipeableRating
      rating={props.rating}
      size={props.size}
      gap={props.gap}
      xOffset={30}
      color="#F5DA28"
      emptyColor="#747474"
      onPress={props.onPress}
    />
  )
}
export default RatingComp
