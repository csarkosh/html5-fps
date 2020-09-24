import React from 'react'
import './LaunchButton.scss'

export default function LaunchButton({ children, onClick,}) {
    return (
        <div className="bg-dark launch-button">
            <button className="btn btn-success" onClick={onClick}>
                {children}
            </button>
            <span className="hint">8 MB</span>
        </div>
    )
}
