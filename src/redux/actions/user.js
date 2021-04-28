import { firebaseDatabase } from '../../firebase/config'
import * as actions from '../actionType'

export const login = ({ username, password }) => async dispatch => {
    dispatch({ type: actions.LOGIN_REQUEST })
    let users = []
    let datas = await firebaseDatabase.collection("users")
    let u = await datas.get()
    for (const doc of u.docs) {
        users.push(doc.data())
    }
    if (users.some(x => x.username === username && x.password === password)) {
        return Promise.resolve(true)
    } else {
        dispatch({ type: actions.LOGIN_FAILURE })
    }

}