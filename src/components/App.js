import React from 'react';
import ReactTooltip from 'react-tooltip';
import './App.scss';
import ReteEditor from './rete/ReteEditor';


export default function App() {

    // TODO: reset after clicking error notification
    let preventSave = null;

    const onEditorSetup = async (editor, engine) => {

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
            try {
                preventSave = !await editor.fromJSON(JSON.parse(stateString));
            }
            catch(err) {
                preventSave = err;
            }
        }
    };

    const onEditorChange = async (state, editor, engine) => {
        if(preventSave) {
            console.warn('Unsaved changes due to load error');
            return;
        }
        localStorage.setItem('editorState', JSON.stringify(state));
    };

    // TODO: add react-router
    // TODO: set up ErrorBanner
    return (
        <>
            <ReactTooltip backgroundColor="#444"/>
            <ReteEditor onSetup={onEditorSetup} onChange={onEditorChange}/>
        </>
    );
};
