import React from 'react'
import { connect } from 'react-redux'

const Notification = ({ message, alertType, show }) => {

    return (
        <div className={`alert ${alertType}`} style={show ?
            { width: '300px', transition: '0.4s'} :
            { width: '0px', transition: '0.4s' }}>
            {message}
        </div>
    )
}

const mapStateToProps = ({ notificationReducer }) => {
    const { message, alertType, show } = notificationReducer
    return { message, alertType, show }
}

export default connect(mapStateToProps)(Notification)
