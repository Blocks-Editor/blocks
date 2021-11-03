import React, {useContext} from 'react';
import EditorPage from './pages/editor/EditorPage';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventsContext, {ERROR_EVENT} from '../contexts/EventsContext';
import useListener from '../hooks/useListener';
import GlobalTooltip from './GlobalTooltip';


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
            {/*<HashRouter>*/}
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
            {/*</HashRouter>*/}
        </React.StrictMode>
    );
};
