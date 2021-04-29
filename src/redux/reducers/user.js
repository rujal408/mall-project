import * as actionType from '../actionType'

const initialInit = {
    loading: false,
    user_token: localStorage.getItem("user_token"),
    mode: "admin"
}

const user = (state = initialInit, action) => {
    switch (action.type) {
        case actionType.LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }

        case actionType.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user_token: action.payload
            }

        case actionType.LOGIN_FAILURE:
            return {
                ...state,
                loading: false
            }

        case actionType.SWITCH_USER:
            return {
                ...state,
                mode: action.payload
            }



        default: return state
    }
}

export default user