import { combineReducers } from 'redux'
import malls from './mall'
import user from './user'

export default combineReducers({
    userReducer: user,
    mallReducer: malls
})