import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMallData, deleteMallData, updateMallData } from '../redux/actions/mall'
import { EDIT_MALL } from '../redux/actionType'

const HOC = (OriginalComponent) => {
    function ComponentUpdated(props) {

        const dispatch = useDispatch()
        const malls = useSelector(state => state.mallReducer.malls)
        const editMode = useSelector(state => state.mallReducer.editMode)
        const user_token = useSelector(state => state.userReducer.user_token)

        React.useEffect(() => {
            dispatch(getMallData())
        }, [dispatch])


        return <OriginalComponent
            {...props}
            user_token={user_token}
            malls={malls}
            editMode={editMode}
            deleteMallData={(data) => dispatch(deleteMallData(data))}
            updateMallData={(id, data) => dispatch(updateMallData(id, data))}
            setEditMode={() => dispatch({ type: EDIT_MALL })}
        />
    }

    return ComponentUpdated
}

export default HOC
