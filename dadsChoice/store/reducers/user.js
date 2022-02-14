const initialState = {
  firstName: '',
  lastName: '',
  address: '',
  email: '',
  city: '',
  postal: '',
  country: '',
  phoneNumber: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USER': {
      return {
        firstName: action.firstName,
        lastName: action.lastName,
        address: action.address,
        email: action.email,
        city: action.city,
        postal: action.postal,
        country: action.country,
        phoneNumber: action.phoneNumber,
        img: action.img,
        region: action.region,
      }
    }
    case 'UPDATE_USER': {
      return {
        firstName: action.firstName,
        lastName: action.lastName,
        address: action.address,
        email: action.email,
        city: action.city,
        postal: action.postal,
        country: action.country,
        phoneNumber: action.phoneNumber,
        img: action.img,
        region: action.region,
      }
    }
  }
  return state
}
