import React from 'react';
import EventEmitter from 'events';

export const EDITOR_CHANGE_EVENT = 'editor-change';
export const ERROR_EVENT = 'error';

// TODO: fix HMR memory leak

const events = new EventEmitter();
events.setMaxListeners(1000);
events.on(ERROR_EVENT, console.error);

export default React.createContext(events);
