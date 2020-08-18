import React from 'react'; 
import ReactDOM from 'react-dom';
import 'spectre.css';
import './spectre.overrides.scss'
import './index.scss';
import './index.escaped.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

/**
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
// eslint-disable-next-line no-extend-native
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
