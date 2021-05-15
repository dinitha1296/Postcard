import React from "react";
import "./toggleMode.css";
import "font-awesome/css/font-awesome.min.css"

function ToggleMode() {
    return (
        <div className="toggleMode">
            <button>
                <i className="fa fa-envelope"></i>
            </button>
            <button>
                <i className="fa fa-comments"></i>
            </button>
        </div>
    );
}

export default ToggleMode;