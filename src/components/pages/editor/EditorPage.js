import Editor from '../../rete/Editor';
import React, {useCallback, useContext} from 'react';
import useListener from '../../../hooks/utils/useListener';
import EventsContext, {
    PROJECT_CLEAR_EVENT,
    PROJECT_EXPORT_EVENT,
    PROJECT_LOAD_EVENT,
} from '../../../contexts/EventsContext';
import FileSaver from 'file-saver';
import {pascalCase} from 'change-case';
import useRedraw from '../../../hooks/utils/useRedraw';
import isEmbedded from '../../../utils/isEmbedded';
import {parse} from 'querystring';

const STORAGE_EDITOR_STATE = 'blocks.editorState';

const DEFAULT_STATE = require('../../../examples/files/DefaultProject.json');

const embedded = isEmbedded();
const storage = embedded ? {} : localStorage; // TODO: convert to `useLocalStorage()`

if(embedded) {
    console.log('Using embedded mode.');
}

let nextEditorState;

export default function EditorPage() {
    const redraw = useRedraw();

    const {menu: menuParam} = parse(window.location.search.substring(1));

    const events = useContext(EventsContext);

    useListener(events, PROJECT_CLEAR_EVENT, () => {
        // TODO: confirmation modal
        // delete storage[STORAGE_EDITOR_STATE];
        nextEditorState = DEFAULT_STATE;
        redraw();
    });

    useListener(events, PROJECT_LOAD_EVENT, state => {
        // storage[STORAGE_EDITOR_STATE] = JSON.stringify(state);
        nextEditorState = state;///
        redraw();
    });

    useListener(events, PROJECT_EXPORT_EVENT, state => {
        let data = JSON.stringify(state);
        FileSaver.saveAs(new Blob([data]), `${pascalCase(state.name || 'project')}.blocks`);
    });

    useListener(window, 'message', ({source, data}) => {
        if(embedded && source === window.parent) {
            if(typeof data === 'string' && data.startsWith('{')) {
                console.log('Received message:', data);
                data = JSON.parse(data);
                if(data?.type === 'load') {
                    nextEditorState = data.state ? JSON.parse(JSON.stringify(data.state)) : DEFAULT_STATE;
                    redraw();
                }
            }
        }
    });

    const onEditorSetup = useCallback(async (loadState, editor) => {
        let stateString = nextEditorState ? JSON.stringify(nextEditorState) : storage[STORAGE_EDITOR_STATE];
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

    const onEditorChange = useCallback((editor) => {
        // if(embedded) {
        //     // TODO: dry with onEditorSave()
        //     let message = {
        //         type: 'change',
        //         state: JSON.stringify(editor.toJSON()),
        //     };
        //     console.log('Sending message:', message);
        //     window.parent.postMessage(message, '*'); // TODO: restrict target origin
        // }
    }, []);

    const onEditorSave = useCallback((state, editor) => {
        console.log('Saving:', state);
        let stateString = JSON.stringify(state);
        storage[STORAGE_EDITOR_STATE] = stateString;
        if(embedded) {
            let message = {
                type: 'save',
                state: stateString,
            };
            console.log('Sending message:', message);
            let targetOrigin = '*'; // TODO: restrict target origin
            window.parent.postMessage(message, targetOrigin);
        }
    }, []);

    return (
        <Editor
            hideMenu={menuParam === 'hidden'}
            onSetup={onEditorSetup}
            onChange={onEditorChange}
            onSave={onEditorSave}
        />
    );
}