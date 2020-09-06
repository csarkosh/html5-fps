import React from 'react'
import {FaPlay} from "react-icons/fa";

function PlayButton() {
    return(
        <button className="btn btn-action btn-xl btn-primary s-circle disabled">
            <FaPlay className="fa-icon" />
        </button>
    )
}

function VideoPreviewer () {
    return (
        <React.Fragment>
            <div className="video-placeholder-wrapper">
                <div className="video-placeholder bg-dark">
                    <div className="video-placeholder-inner">
                        <PlayButton />
                    </div>
                </div>
            </div>
            <div className="video-placeholder-static bg-dark">
                <PlayButton />
            </div>
        </React.Fragment>
    )
}

export default VideoPreviewer
