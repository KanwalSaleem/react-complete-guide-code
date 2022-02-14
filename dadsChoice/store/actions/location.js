export const getLocation = (longitude, latitude) => ({
  type: 'SET_LOCATION',
  longitude,
  latitude,
})

export const setAddress = (address) => ({
  type: 'SET_ADDRESS',
  address,
})
