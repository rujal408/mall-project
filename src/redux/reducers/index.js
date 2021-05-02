import { combineReducers } from 'redux'
import malls from './mall'
import notification from './notification'
import user from './user'

export default combineReducers({
    userReducer: user,
    mallReducer: malls,
    notificationReducer: notification
})