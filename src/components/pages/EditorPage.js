// Temporary localStorage keys
import useListener from '../../hooks/useListener';
import Editor from '../rete/Editor';
import {FormCheck} from 'react-bootstrap';
import React from 'react';
import {toast} from 'react-toastify';

const STORAGE_AUTOSAVE = 'blocks.autosave';
const STORAGE_EDITOR_STATE = 'blocks.editorState';

export default function EditorPage() {

    let editorRef;

    const onEditorSetup = async (loadState, editor) => {

        editorRef = editor;

        let stateString = localStorage[STORAGE_EDITOR_STATE];
        if(stateString) {
            let state = JSON.parse(stateString);
            if(!await loadState(state)) {
                console.warn('Load error');
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
                // TODO: subtle animation
            }
        }
    });

    return (
        <>
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
}