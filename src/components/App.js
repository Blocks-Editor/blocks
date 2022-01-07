import React, {useContext, useEffect} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventsContext, {ERROR_EVENT} from '../contexts/EventsContext';
import useListener from '../hooks/utils/useListener';
import GlobalTooltip from './global/GlobalTooltip';
import {BrowserRouter} from 'react-router-dom';
import TabLayout from './TabLayout';
import GlobalTheme from './global/GlobalTheme';
import GlobalObservables from './global/GlobalObservables';
import {isSafari} from 'react-device-detect';

export default function App() {
    const events = useContext(EventsContext);

    useListener(events, ERROR_EVENT, err => {
        toast(err, {
            type: 'error',
            // closeOnClick: true,
        });
    });

    useEffect(() => {
        // Check user agent on load
        const storageFlag = 'blocks.safariWarning';
        if(isSafari && !sessionStorage[storageFlag]) {
            toast('If you\'re experiencing performance issues, we recommend using Blocks in Google Chrome or Mozilla Firefox.', {
                autoClose: false,
                onClose() {
                    sessionStorage[storageFlag] = 'true';
                },
            });
        }
    });

    return (
        <React.StrictMode>
            <GlobalObservables/>
            <GlobalTooltip/>
            <BrowserRouter>
                <GlobalTheme>
                    <ToastContainer style={{marginTop: '5rem'}} position="top-right"/>
                    {/*<div className="d-block d-sm-none w-100 h-100">*/}
                    {/*    <MobilePage/>*/}
                    {/*</div>*/}
                    {/*<div className="d-none d-sm-block w-100 h-100">*/}
                    <TabLayout/>
                    {/*</div>*/}
                </GlobalTheme>
            </BrowserRouter>
        </React.StrictMode>
    );
}
