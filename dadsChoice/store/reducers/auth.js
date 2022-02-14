const initialState = {
  token: null,
  roleId: '',
  pushId: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'AUTHENTICATE': {
      return {
        ...state,
        userId: action.userId,
        token: action.token,
        roleId: action.roleId,
        triedLogin: true,
      }
    }
    case 'TRY_LOGIN': {
      return {
        ...state,
        triedLogin: true,
      }
    }

    case 'LOGOUT': {
      return {userId: null, token: null, roleId: null}
    }
    case 'PUSH_ID': {
      return {...state, pushId: action.pushId}
    }
  }
  return state
}
