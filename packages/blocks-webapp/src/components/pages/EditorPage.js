import Editor from '../rete/Editor';
import React from 'react';

const STORAGE_AUTOSAVE = 'blocks.autosave';
const STORAGE_EDITOR_STATE = 'blocks.editorState';

export default function EditorPage() {

    const onEditorSetup = async (loadState, editor) => {

        let stateString = localStorage[STORAGE_EDITOR_STATE];
        if(stateString) {
            let state = JSON.parse(stateString);
            if(!await loadState(state)) {
                console.warn('Load error');
            }
        }
    };

    const onEditorSave = (state, editor) => {
        localStorage[STORAGE_EDITOR_STATE] = JSON.stringify(state);
    };

    return (
        <div className="d-flex flex-column">
            <div className="node-editor-menu">
                {/*TODO: menu*/}
            </div>
            <Editor
                className="flex-grow-1"
                onSetup={onEditorSetup}
                onChange={() => localStorage[STORAGE_AUTOSAVE] && onEditorSave()}
                onSave={onEditorSave}
            />
        </div>
    );
}