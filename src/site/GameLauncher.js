import React from 'react'
import {FaChrome, FaEdge, FaFirefox, FaSafari} from "react-icons/fa";

const warning = false

export default function GameLauncher({ installEnabled, onBrowserLaunch, onInstall }) {
    const enabled = installEnabled ? '' : 'disabled'
    return (
        <div className="launcher bg-secondary text-primary">
            Play 3D Web Game
            <div className="launcher-action">
                <div className="bg-dark launcher-action-install">
                    <span className="launcher-price">Free</span>
                    <button className={`btn btn-success ${enabled}`} onClick={onInstall}>
                        Install Game
                    </button>
                </div>
                <button
                    className={`btn btn-link btn-link-sm strike ${warning ? 'disabled' : ''}`}
                    onClick={onBrowserLaunch}
                >
                    Or play in browser
                </button>
            {warning && (
                <div className="bg-error btn-link-sm">
                    Your browser does not support fullscreen web games
                </div>
            )}
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
