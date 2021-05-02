import { SET_ALERT, REMOVE_ALERT } from '../actionType'

export const setAlert = (alertType, message) => dispatch => {
    dispatch({ type: SET_ALERT, alertType, message })
    setTimeout(() => {
        dispatch({ type: REMOVE_ALERT })
    }, 2000)
}