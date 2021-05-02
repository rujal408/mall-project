import React from 'react'
import { connect } from 'react-redux'

const Notification = ({ message, alertType, show }) => {
    return (
        <div className={`alert-${alertType} ${show ? 'animate' : 'non-animate'}`}>
            {message}
        </div>
    )
}

const mapStateToProps = ({ notificationReducer }) => {
    const { message, alertType, show } = notificationReducer
    return { message, alertType, show }
}

export default connect(mapStateToProps)(Notification)
