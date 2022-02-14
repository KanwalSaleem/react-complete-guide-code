const initialState = {
  longitude: '',
  latitude: '',
  address: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCATION': {
      return {...state, longitude: action.longitude, latitude: action.latitude}
    }
    case 'SET_ADDRESS': {
      return {...state, address: action.address}
    }
  }
  return state
}
