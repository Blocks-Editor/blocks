import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.scss';
import App from './components/App';
import './setupFirebase';

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root'),
);

// reportWebVitals((...args) => {
//     console.log('WebVitals:', ...args);
// });
