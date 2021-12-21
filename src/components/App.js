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
import MobilePage from './MobilePage';
import { isSafari } from 'react-device-detect';

export default function App() {
    const events = useContext(EventsContext);

    useEffect(() => {
        // Check user agent on load
        if(isSafari) {
            toast('Blocks currently has intermittent performance issues on Safari. For now, we recommend Chrome for the best experience.', {
                autoClose: false
            });
        }
    });



    useListener(events, ERROR_EVENT, err => {
        toast(err, {
            type: 'error',
            // closeOnClick: true,
        });
    });

    return (
        <React.StrictMode>
            <GlobalObservables/>
            <GlobalTooltip/>
            <BrowserRouter>
                <GlobalTheme>
                    <ToastContainer style={{marginTop: '5rem'}} position='top-center'/>
                    <div className="d-block d-sm-none w-100 h-100">
                        <MobilePage/>
                    </div>
                    <div className="d-none d-sm-block w-100 h-100">
                        <TabLayout/>
                    </div>
                    {/*<Switch>*/}
                    {/*    <Route path="/editor">*/}
                    {/*        <EditorPage/>*/}
                    {/*    </Route>*/}
                    {/*    <Route path="/">*/}
                    {/*        <HomePage/>*/}
                    {/*    </Route>*/}
                    {/*</Switch>*/}
                </GlobalTheme>
            </BrowserRouter>
        </React.StrictMode>
    );
}
