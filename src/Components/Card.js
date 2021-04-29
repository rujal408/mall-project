import React, { useState } from 'react'
import ClearIcon from '@material-ui/icons/Clear';

function Card(props) {
    
    const [hover, setHover] = useState(false)
      
    return (
        <div
            style={{ height: "220px", width: "100%", position: "relative" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={props.handleClick}
        >

            <div
                className="mall"
                style={{
                    backgroundImage: `url(${props.url})`,
                    filter: hover ? "blur(0.2px)" : "blur(1.6px)",
                    borderRadius: "9px"
                }}>

            </div>
            {
                props.adminMode &&
                <>
                    {hover && <ClearIcon
                        className="delete-icon"
                        onClick={(e) => { e.stopPropagation(); props.crossClick(e) }}
                    />}
                </>
            }


            <div className={`mall-content ${props.className}`}>
                <div>
                    <h1>{props.name}</h1>
                </div>
                <div>
                    <h3>
                        {props.description}
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default Card
