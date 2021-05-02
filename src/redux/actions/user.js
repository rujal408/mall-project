import { firebaseDatabase } from '../../firebase/config'
import * as actions from '../actionType'
import { setAlert } from './notification'

export const login = ({ username, password }) => async dispatch => {
    dispatch({ type: actions.LOGIN_REQUEST })
    let users = []
    let datas = await firebaseDatabase.collection("users")
    let u = await datas.get()
    for (const doc of u.docs) {
        users.push(doc.data())
    }
    if (users.some(x => x.username === username && x.password === password)) {
        dispatch(setAlert("success", "You are logged in"))
        return Promise.resolve(true)
    } else {
        dispatch(setAlert("error", "Error Login"))
        dispatch({ type: actions.LOGIN_FAILURE })
    }

}