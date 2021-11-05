import React, {useContext} from 'react';
import EditorPage from './pages/editor/EditorPage';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventsContext, {ERROR_EVENT} from '../contexts/EventsContext';
import useListener from '../hooks/useListener';
import GlobalTooltip from './GlobalTooltip';
import {BrowserRouter} from 'react-router-dom';


export default function App() {

    let events = useContext(EventsContext);

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
                <EditorPage/>
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
};
