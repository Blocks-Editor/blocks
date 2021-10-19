import React from 'react';
import EventEmitter from 'events';

export const EDITOR_CHANGE_EVENT = 'editor-change';
export const ERROR_EVENT = 'error';

const events = new EventEmitter();
events.setMaxListeners(100);
events.on(ERROR_EVENT, console.error);

export default React.createContext(events);
