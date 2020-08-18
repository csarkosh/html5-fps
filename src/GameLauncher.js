import React from 'react'
import {FaChrome, FaEdge, FaFirefox, FaSafari} from "react-icons/fa";

function GameLauncher({ onBrowserLaunch, onInstall }) {
    return (
        <div className="launcher bg-secondary text-primary">
            Play 3D Web Game
            <div className="launcher-action">
                <div className="bg-dark">
                    <span className="launcher-price">Free</span>
                    <button className="btn btn-success disabled" onClick={onInstall}>
                        Install Game
                    </button>
                </div>
                <button className="btn btn-link btn-link-sm" onClick={onBrowserLaunch}>
                    Or play in browser
                </button>
            </div>
            <div className="launcher-support">
                <FaChrome />
                <FaEdge />
                <FaFirefox />
                <FaSafari />
            </div>
        </div>
    )
}

export default GameLauncher
