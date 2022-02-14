const initialState = {
  token: null,
  user: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTHENTICATE': {
      return {
        ...state,
        user: action.user,
        token: action.token,
        triedLogin: true,
      }
    }
    case 'TRY_LOGIN': {
      return {
        ...state,
        triedLogin: true,
      }
    }
  }
  return state
}
