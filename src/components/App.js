import React, {useContext} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventsContext, {ERROR_EVENT} from '../contexts/EventsContext';
import useListener from '../hooks/utils/useListener';
import GlobalTooltip from './GlobalTooltip';
import {BrowserRouter} from 'react-router-dom';
import TabLayout from './TabLayout';


export default function App() {
    const events = useContext(EventsContext);

    useListener(events, ERROR_EVENT, err => {
        toast(err, {
            type: 'error',
            // closeOnClick: true,
        });
    });

    return (
        <React.StrictMode>
            <BrowserRouter>
                <GlobalTooltip/>
                <ToastContainer/>
                <TabLayout/>
                {/*<Switch>*/}
                {/*    <Route path="/editor">*/}
                {/*        <EditorPage/>*/}
                {/*    </Route>*/}
                {/*    <Route path="/">*/}
                {/*        <HomePage/>*/}
                {/*    </Route>*/}
                {/*</Switch>*/}
            </BrowserRouter>
        </React.StrictMode>
    );
}
