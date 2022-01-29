import Editor from './Editor';
import React, {useCallback, useContext} from 'react';
import useListener from '../../hooks/utils/useListener';
import EventsContext, {
    PROJECT_CLEAR_EVENT,
    PROJECT_EXPORT_EVENT,
    PROJECT_LOAD_EVENT,
} from '../../contexts/EventsContext';
import FileSaver from 'file-saver';
import {pascalCase} from 'change-case';
import useRedraw from '../../hooks/utils/useRedraw';
import isEmbeddedMode from '../../utils/isEmbeddedMode';
import {EDITOR_STORE} from '../../observables/editorStore';
import {EDITOR_STATE_STORE} from '../../observables/editorStateStore';
import {UndoRedoHistory} from '../../plugins/rete-blocks-history-plugin';
import {logTelemetry} from '../../telemetry';
import parseMotoko from '../../parsers/parseMotoko';
import generateBlocksFromParseResult from '../../parsers/generateBlocksFromParseResult';


const STORAGE_EDITOR_STATE = 'blocks.editorState';

const DEFAULT_STATE = require('../../examples/misc/DefaultProject.json');

const embedded = isEmbeddedMode();
const storage = embedded ? {} : localStorage; // TODO: convert to `useLocalStorage()`

const history = new UndoRedoHistory(50);

let nextEditorState;

export default function EditorPage() {
    const redraw = useRedraw();

    const events = useContext(EventsContext);

    // Temporary global Motoko parser
    window.LOAD_MOTOKO = (input) => {
        const result = parseMotoko(input);
        console.log(result);
        const state = generateBlocksFromParseResult(result);
        events.emit(PROJECT_LOAD_EVENT, state);
        return state;
    };

    useListener(events, PROJECT_CLEAR_EVENT, () => {
        logTelemetry('project_clear');
        // TODO: confirmation modal
        // delete storage[STORAGE_EDITOR_STATE];
        nextEditorState = DEFAULT_STATE;
        redraw();
    });

    useListener(events, PROJECT_LOAD_EVENT, state => {
        logTelemetry('project_load', {project: state.name || ''});
        // storage[STORAGE_EDITOR_STATE] = JSON.stringify(state);
        nextEditorState = state;///
        redraw();
    });

    useListener(events, PROJECT_EXPORT_EVENT, state => {
        logTelemetry('project_export', {project: state.name || ''});
        const data = JSON.stringify(state);
        FileSaver.saveAs(new Blob([data]), `${pascalCase(state.name || 'project')}.blocks`);
    });

    useListener(window, 'message', ({source, data}) => {
        if(embedded && source === window.parent) {
            if(typeof data === 'string' && data.startsWith('{')) {
                if(process.env.NODE_ENV === 'development') {
                    console.log('Received message:', data);
                }
                data = JSON.parse(data);
                if(data?.type === 'load') {
                    nextEditorState = data.state ? JSON.parse(JSON.stringify(data.state)) : DEFAULT_STATE;
                    redraw();
                }
            }
        }
    });

    const sendMessage = (message) => {
        if(embedded) {
            if(process.env.NODE_ENV === 'development') {
                console.log('Sending message:', message);
            }
            const targetOrigin = '*'; // TODO: restrict target origin?
            window.parent.postMessage(message, targetOrigin);
        }
    };

    const onEditorSetup = useCallback(async (loadState, editor) => {
        const stateString = nextEditorState ? JSON.stringify(nextEditorState) : storage[STORAGE_EDITOR_STATE];
        nextEditorState = null;

        let state;
        if(stateString) {
            state = JSON.parse(stateString);
        }
        else if(!embedded) {
            state = DEFAULT_STATE;
        }

        if(state && !await loadState(state)) {
            console.warn('Load error');
        }
    }, []);

    // let previousState = {};
    const onEditorChange = useCallback((editor) => {
        const state = editor.toJSON();
        // const patch = compare(previousState, state);
        // previousState = state;
        // console.log('Patch:', patch);///

        editor.trigger('history', state);

        EDITOR_STATE_STORE.set(state);
        // UNSAVED_CHANGES_STORE.set(true);
    }, []);

    const onEditorSave = useCallback((state, editor) => {
        // console.log('Saving:', state);
        storage[STORAGE_EDITOR_STATE] = JSON.stringify(state);
        sendMessage({
            type: 'save',
            state: state,
        });
        // UNSAVED_CHANGES_STORE.set(false);
    }, []);

    return (
        <Editor
            observable={EDITOR_STORE}
            onSetup={onEditorSetup}
            onChange={onEditorChange}
            onSave={onEditorSave}
            history={history}
        />
    );
}
