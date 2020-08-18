import React from 'react'
import {FaExternalLinkAlt} from "react-icons/fa";

function Glance() {
    return (
        <div className="glance">
            <div className="glance-description">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="glace-dev-grid">
                    <div className="m-bottom-4">RELEASE DATE:</div>
                    <div className="m-bottom-4">Coming Soon</div>
                    <div>DEVELOPER:</div>
                    <div>
                        <a href="https://csarko.sh" target="_blank" rel="noopener noreferrer">
                            Cyrus Sarkosh <FaExternalLinkAlt />
                        </a>
                    </div>
                    <div className="m-bottom-4">PUBLISHER:</div>
                    <div className="m-bottom-4">
                        <a href="https://csarko.sh" target="_blank" rel="noopener noreferrer">
                            Cyrus Sarkosh <FaExternalLinkAlt />
                        </a>
                    </div>
                    <div>GENRES:</div>
                    <div>
                        <span className="glace-genre bg-secondary text-primary">Action</span>
                        <span className="glace-genre bg-secondary text-primary">First-Person</span>
                        <span className="glace-genre bg-secondary text-primary">Shooter</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Glance