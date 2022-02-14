const initialState = {
  latitude: 37.4219983,
  longitude: -122.084,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_LOCATION': {
      return {latitude: action.latitude, longitude: action.longitude}
    }
  }
  return state
}
