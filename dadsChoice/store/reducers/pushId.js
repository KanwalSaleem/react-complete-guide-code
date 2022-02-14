const initialState = {
  pushId: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'PUSH_ID': {
      return {...state, pushId: action.pushId}
    }
  }
  return state
}
