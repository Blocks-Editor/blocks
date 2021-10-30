import React, {useContext} from 'react';
import './App.scss';
import EditorPage from './pages/EditorPage';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventsContext, {ERROR_EVENT} from '../contexts/EventsContext';
import useListener from '../hooks/useListener';
import ReactTooltip from 'react-tooltip';
import {HashRouter, Route, Switch} from 'react-router-dom';
import HomePage from './pages/HomePage';

export default function App() {

    let events = useContext(EventsContext);

    useListener(events, ERROR_EVENT, err => {
        toast(err, {
            type: 'error',
            // closeOnClick: true,
        });
    });

    return (
        <HashRouter>
            <ReactTooltip className="tooltip" backgroundColor="#111" place="bottom"/>
            <ToastContainer/>
            <Switch>
                <Route path="/editor">
                    <EditorPage/>
                </Route>
                <Route path="/">
                    <HomePage/>
                </Route>
            </Switch>
        </HashRouter>
    );
};
