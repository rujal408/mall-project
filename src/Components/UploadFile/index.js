import React from 'react'

const UploadFile = React.forwardRef(({ name, label, message, onChange, ...rest }, ref) => {
    return (
        <div className="upload-btn-wrapper">
            <button className="btn">{label}</button>
            <input ref={ref} type="file" name={name} onChange={onChange} {...rest} />
            <div style={{ color: "red" }}>
                {message}
            </div>
        </div>
    )
})

export default UploadFile
