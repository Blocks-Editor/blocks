import Editor from '../../rete/Editor';
import React, {useContext} from 'react';
import useListener from '../../../hooks/useListener';
import EventsContext, {PROJECT_CLEAR_EVENT, PROJECT_EXPORT_EVENT} from '../../../contexts/EventsContext';
import FileSaver from 'file-saver';
import {pascalCase} from 'change-case';
import useRedraw from '../../../hooks/useRedraw';

const STORAGE_EDITOR_STATE = 'blocks.editorState';

export default function EditorPage() {

    const events = useContext(EventsContext);

    const redraw = useRedraw();

    useListener(events, PROJECT_CLEAR_EVENT, () => {
        // TODO: confirmation
        delete localStorage[STORAGE_EDITOR_STATE];
        redraw();
    });

    useListener(events, PROJECT_EXPORT_EVENT, (data) => {
        FileSaver.saveAs(new Blob([data]), `${pascalCase(data.projectName || 'project')}.blocks.json`);
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
        <div className="d-flex flex-column">
            <Editor
                className="flex-grow-1"
                onSetup={onEditorSetup}
                onChange={onEditorChange}
                onSave={onEditorSave}
            />
        </div>
    );
}