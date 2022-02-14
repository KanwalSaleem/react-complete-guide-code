import { ACTION_TYPES } from "../utils"
const initialState = {
    getProjectOEM_response: {},
}
export default function projectReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.GET_PROJECT_TEST: {
            return {
                ...state,
                getProjectOEM_response: action.payload,
            }
        }
        default: {
            return state
        }
    }
}