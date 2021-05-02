import { firebaseDatabase } from '../../firebase/config'
import { deleteFile } from '../../firebase/fireStorage'
import * as actionType from '../actionType'
import { setAlert } from './notification'

export const addMallData = (data) => dispatch => {
    dispatch({ type: actionType.ADD_MALL_REQUEST })
    firebaseDatabase.collection("malls").add(data)
}

export const onSnapShotData = () => dispatch => {
    dispatch({ type: actionType.FETCH_MALL_REQUEST })
    firebaseDatabase.collection("malls").onSnapshot(snap => {
        let arr = []
        snap.forEach(da => {
            arr.push({ id: da.id, ...da.data() })
        })
        dispatch({ type: actionType.FETCH_MALL_SUCCESS, payload: arr })

    }, error => {
        dispatch({ type: actionType.FETCH_MALL_FAILURE })
    })
}

export const getMallData = () => dispatch => {
    dispatch({ type: actionType.FETCH_MALL_REQUEST })
    firebaseDatabase.collection("malls").get().then((doc) => {
        let arr = []
        doc.forEach(da => {
            arr.push({ id: da.id, ...da.data() })
        })
        dispatch({ type: actionType.FETCH_MALL_SUCCESS, payload: arr })
    }).catch(err => {
        dispatch({ type: actionType.FETCH_MALL_FAILURE })
    })
}

export const updateMallData = (id, data) => dispatch => {
    dispatch({ type: actionType.UPDATE_MALL_REQUEST })
    dispatch(onSnapShotData())
    firebaseDatabase.collection("malls").doc(id).update(data).then(resp => {
        dispatch({ type: actionType.UPDATE_MALL_SUCCESS })
    }).catch(err => {
        dispatch({ type: actionType.UPDATE_MALL_FAILURE })
    })
}

export const deleteMallData = (data) => dispatch => {
    dispatch({ type: actionType.DELETE_MALL_REQUEST })
    firebaseDatabase.collection("malls").doc(data.id).delete().then(() => {
        deleteFile(data.mall_image.id)
        data.shops.forEach(shop => {
            shop.images.forEach(image => {
                deleteFile(image.id)
            })
        })
        dispatch(setAlert("success", "Mall has been deleted successfully"))
        dispatch({ type: actionType.DELETE_MALL_SUCCESS, payload: data.id })

    })
}