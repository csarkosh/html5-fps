import React from 'react'
import {FaDesktop, FaMobileAlt, FaUser} from "react-icons/fa";

function Categories() {
    return (
        <div className="categories">
            <div className="text-center bg-dark"><FaUser /></div>
            <div className="bg-secondary text-primary h-padding-6">Single Player</div>
            <div className="text-center bg-dark"><FaDesktop /></div>
            <div className="bg-secondary text-primary h-padding-6">Desktop Support</div>
            <div className="text-center bg-dark"><FaMobileAlt /></div>
            <div className="bg-secondary text-primary h-padding-6">Mobile Support</div>
        </div>
    )
}

export default Categories