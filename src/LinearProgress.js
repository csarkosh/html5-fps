import React from 'react'

function LinearProgress(props) {
    return (
        <div className="linear-root bg-secondary" {...props}>
            <div className="linear-bar bg-primary linear-indeterminate1" />
            <div className="linear-bar bg-primary linear-indeterminate2" />
        </div>
    )
}

export default LinearProgress
