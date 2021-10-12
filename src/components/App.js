import React from 'react';
import ReactTooltip from 'react-tooltip';
import './App.scss';
import Editor from './rete/Editor';


export default function App() {

    // TODO: reset after clicking error notification
    let preventSave = null;

    const onEditorSetup = async (loadState, editor, engine) => {

        let stateString = localStorage.getItem('editorState')/* || {
            id: editor.id,
            nodes: {
                '1': {
                    id: '1',
                    data: {},
                    outputs: {
                        value: {connections: [{node: '2', input: 'value', data: {}}]},
                    },
                    position: [-300, -100],
                    name: 'LiteralInt',
                },
                '2': {
                    id: '2',
                    data: {},
                    position: [100, -100],
                    name: 'Return',
                },
            },
        }*/;

        if(stateString) {
            let state = JSON.parse(stateString);
            if(!await loadState(state)) {
                console.warn('Load error');
                preventSave = true;
                localStorage.removeItem('editorState');////
            }
        }
    };

    const onEditorChange = async (state, editor, engine) => {
        if(preventSave) {
            console.warn('Preventing changes due to load error');
            return;
        }
        localStorage.setItem('editorState', JSON.stringify(state));
    };

    // TODO: add react-router
    // TODO: set up ErrorBanner or similar
    return (
        <>
            <ReactTooltip backgroundColor="#444"/>
            <Editor onSetup={onEditorSetup} onChange={onEditorChange}/>
        </>
    );
};
