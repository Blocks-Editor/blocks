import React from 'react';
import EventEmitter from 'events';

// Event names for this application
export const EDITOR_PROCESS_EVENT = 'editor_process';
export const ERROR_EVENT = 'error';

const events = new EventEmitter();
events.on(ERROR_EVENT, console.error);

export default React.createContext(events);
