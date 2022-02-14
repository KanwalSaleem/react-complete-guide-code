import { ACTION_TYPES } from "../utils"
export const getProject_user = (url_path) => {
    return async dispatch => {
        dispatch({
            type: ACTION_TYPES.GET_PROJECT_TEST,
            payload: {
                "name": "Mukesh Kumar Saket",
                "locaiton": "Bangalore"
            }
        })
    }
}