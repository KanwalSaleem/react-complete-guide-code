const initialState = {
  id: '',
  status: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CAREGIVER_ITEM': {
      return {...state, id: action.id, status: action.status}
    }
    case 'GET_CAREGIVER_ITEM': {
      return {...state, id: action.id, status: action.status}
    }

    case 'REMOVE_CAREGIVER_ITEM': {
      return {...state, id: '', status: ''}
    }
  }
  return state
}
