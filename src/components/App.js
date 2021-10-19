import React from 'react';
import ReactTooltip from 'react-tooltip';
import './App.scss';
import Editor from './rete/Editor';
import {FormCheck} from 'react-bootstrap';
import useListener from '../hooks/useListener';

// Temporary localStorage keys
const STORAGE_AUTOSAVE = 'blocks.autosave';
const STORAGE_EDITOR_STATE = 'blocks.editorState';

export default function App() {

    let editorRef;

    const onEditorSetup = async (loadState, editor) => {

        editorRef = editor;

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

    const saveEditorState = () => {
        if(!editorRef) {
            console.error('Could not find editor');
            return;
        }
        localStorage[STORAGE_EDITOR_STATE] = JSON.stringify(editorRef.toJSON());
    };

    useListener(window, 'keydown', event => {
        if(event.ctrlKey || event.metaKey) {
            let key = String.fromCharCode(event.which).toLowerCase();
            if(key === 's') {
                event.preventDefault();
                saveEditorState();
                console.log('Saved successfully');
                // TODO: confirmation popup
            }
        }
    });

    // TODO: add react-router?
    // TODO: set up ErrorBanner or similar
    return (
        <>
            <ReactTooltip backgroundColor="#444"/>
            <Editor onSetup={onEditorSetup} onChange={() => localStorage[STORAGE_AUTOSAVE] && saveEditorState()}/>
            {/* Temporary autosave panel */}
            <div style={{position: 'absolute', left: 0, top: 0, background: '#0005', color: 'white', padding: '.5em'}}>
                <FormCheck>
                    <FormCheck.Input
                        id="autosave-input"
                        ref={el => el && (el.checked = !!localStorage[STORAGE_AUTOSAVE])}
                        onChange={event => {
                            // event.target.checked = !event.target.checked;
                            let autosave = event.target.checked;
                            if(autosave) {
                                localStorage[STORAGE_AUTOSAVE] = 'yes';
                            }
                            else {
                                delete localStorage[STORAGE_AUTOSAVE];
                            }
                            if(autosave) {
                                saveEditorState();
                            }
                        }}
                    />
                    <FormCheck.Label htmlFor="autosave-input">Autosave</FormCheck.Label>
                </FormCheck>
            </div>
        </>
    );
};
