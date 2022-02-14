import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"
// import { reducer as formReducer } from "redux-form"
import projectReducer from "./projectReducer"
const appReducer = combineReducers({
    routing: routerReducer,
    projectReducer
})

export default appReducer