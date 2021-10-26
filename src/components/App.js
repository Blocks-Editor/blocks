import React, {useContext} from 'react';
import './App.scss';
import EditorPage from './pages/EditorPage';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventsContext, {ERROR_EVENT} from '../contexts/EventsContext';
import useListener from '../hooks/useListener';
import ReactTooltip from 'react-tooltip';

export default function App() {

    let events = useContext(EventsContext);

    useListener(events, ERROR_EVENT, err => {
        toast(err, {
            type: 'error',
            // closeOnClick: true,
        });
    });

    // TODO: add react-router?
    return (
        <>
            <ReactTooltip backgroundColor="#111" className="tooltip"/>
            <ToastContainer/>
            <EditorPage/>
        </>
    );
};
