import React, {useState} from 'react';
import ReactTooltip from 'react-tooltip';
import './App.scss';
import Editor from './rete/Editor';
import {FormCheck} from 'react-bootstrap';

// Temporary localStorage keys
const STORAGE_AUTOSAVE = 'blocks.autosave';
const STORAGE_EDITOR_STATE = 'blocks.editorState';

export default function App() {

    const onEditorSetup = async (loadState, editor, engine) => {

        let stateString = localStorage[STORAGE_EDITOR_STATE]/* || {
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
                // localStorage.removeItem(STORAGE_EDITOR_STATE);////
            }
        }
    };

    const onEditorChange = async (state, editor, engine) => {
        if(localStorage[STORAGE_AUTOSAVE]) {
            localStorage[STORAGE_EDITOR_STATE] = JSON.stringify(state);
        }
    };

    // TODO: add react-router
    // TODO: set up ErrorBanner or similar
    return (
        <>
            <ReactTooltip backgroundColor="#444"/>
            <Editor onSetup={onEditorSetup} onChange={onEditorChange}/>
            {/* Temporary autosave panel */}
            <div style={{position: 'absolute', left: 0, top: 0, background: '#0002', padding: '.5em'}}>
                <FormCheck>
                    <FormCheck.Input
                        id="autosave-input"
                        ref={el => el && (el.checked = !!localStorage[STORAGE_AUTOSAVE])}
                        onChange={event => {
                            // event.target.checked = !event.target.checked;
                            localStorage[STORAGE_AUTOSAVE] = event.target.checked ? 'yes' : '';
                        }}
                    />
                    <FormCheck.Label htmlFor="autosave-input">Autosave</FormCheck.Label>
                </FormCheck>
            </div>
        </>
    );
};
