import React from 'react'

function UploadFile({ onChange, name, label, ...rest }) {
    return (
        <div className="upload-btn-wrapper">
            <button className="btn">{label}</button>
            <input type="file" name={name} {...rest} onChange={onChange} />
        </div>
    )
}

export default UploadFile
