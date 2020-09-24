import React from 'react'
import {FaChrome, FaEdge, FaFirefox, FaSafari} from "react-icons/fa";
import LaunchButton from "./LaunchButton";
import './LauncherPanel.scss'


export default function LauncherPanel({
    onLaunch
}) {
    return (
        <div className="launcher-panel bg-secondary text-primary">
            <LaunchButton onClick={onLaunch}>
                Launch Game
            </LaunchButton>
            <div className="launcher-support">
                <FaChrome />
                <FaEdge />
                <FaFirefox />
                <FaSafari />
            </div>
        </div>
    )
}
