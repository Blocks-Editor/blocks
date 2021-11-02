import Editor from '../../rete/Editor';
import React, {useContext} from 'react';
import useListener from '../../../hooks/useListener';
import EventsContext, {
    PROJECT_CLEAR_EVENT,
    PROJECT_EXPORT_EVENT,
    PROJECT_LOAD_EVENT,
} from '../../../contexts/EventsContext';
import FileSaver from 'file-saver';
import {pascalCase} from 'change-case';
import useRedraw from '../../../hooks/useRedraw';

const STORAGE_EDITOR_STATE = 'blocks.editorState';

export default function EditorPage() {

    const events = useContext(EventsContext);

    const redraw = useRedraw();

    useListener(events, PROJECT_CLEAR_EVENT, () => {
        // TODO: confirmation modal
        delete localStorage[STORAGE_EDITOR_STATE];
        redraw();
    });

    useListener(events, PROJECT_LOAD_EVENT, state => {
        localStorage[STORAGE_EDITOR_STATE] = JSON.stringify(state);
        redraw();
    });

    useListener(events, PROJECT_EXPORT_EVENT, state => {
        let data = JSON.stringify(state);
        FileSaver.saveAs(new Blob([data]), `${pascalCase(state.name || 'project')}.blocks.json`);
    });

    const onEditorSetup = async (loadState, editor) => {
        let stateString = localStorage[STORAGE_EDITOR_STATE];
        if(stateString) {
            let state = JSON.parse(stateString);
            if(!await loadState(state)) {
                console.warn('Load error');
            }
        }
    };

    const onEditorChange = (editor) => {
    };

    const onEditorSave = (state, editor) => {
        localStorage[STORAGE_EDITOR_STATE] = JSON.stringify(state);
    };

    return (
        <Editor
            onSetup={onEditorSetup}
            onChange={onEditorChange}
            onSave={onEditorSave}
        />
    );
}