import React from 'react';
import ReactTooltip from 'react-tooltip';
import './App.scss';
import ReteEditor from './rete/ReteEditor';


export default function App() {

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
            await editor.fromJSON(JSON.parse(stateString));
        }
    };

    const onEditorChange = async (editor, engine) => {
        let state = editor.toJSON();
        // console.log('State:', state);

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
