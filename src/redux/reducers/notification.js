import { SET_ALERT, REMOVE_ALERT } from '../actionType'

const initialState = {
    message: "",
    show: false,
    alertType: "",
}

const notification = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALERT:
            return {
                message: action.message,
                show: true,
                alertType: action.alertType
            }

        case REMOVE_ALERT:
            return {
                show: false,
            }
        default: return state
    }
}

export default notification;