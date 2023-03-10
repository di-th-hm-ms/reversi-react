// import React, { useState } from 'react'
function Cell(props) {
    return (
        <button className="cell" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

export default Cell;
