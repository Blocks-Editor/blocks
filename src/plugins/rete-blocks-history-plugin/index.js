export class UndoRedoHistory {
    constructor(maxLength, delay = 500) {
        this.maxLength = maxLength;
        this.delay = delay;

        this.undoHistory = [];
        this.redoHistory = [];

        this.current = undefined;
        this._timeout = undefined;
    }

    clear() {
        this.undoHistory.length = 0;
        this.redoHistory.length = 0;
        this._resetCurrent();
    }

    _resetCurrent() {
        this.current = undefined;
        clearTimeout(this._timeout);
        this._timeout = undefined;
    }

    _applyCurrent() {
        this.redoHistory.length = 0;
        this.undoHistory.push(this.current);
        while(this.undoHistory.length > this.maxLength) {
            this.undoHistory.shift();
        }
        // console.log('Current:', this.current);////
    }

    add(state) {
        this.current = state;
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this._applyCurrent();
        }, this.delay);
    }

    undo() {
        if(this.undoHistory.length) {
            const state = this.undoHistory.pop();
            this.redoHistory.push(state);
            return state;
        }
    }

    redo() {
        if(this.redoHistory.length) {
            const state = this.redoHistory.pop();
            this.undoHistory.push(state);
            return state;
        }
    }
}

function install(editor, {history} = {}) {
    editor.bind('history');
    editor.bind('undo');
    editor.bind('redo');

    if(!history || typeof history === 'number') {
        history = new UndoRedoHistory(history);
    }

    editor.on('history', (state) => {
        history.add(state);
    });
    editor.on('undo', () => {
        history.undo();
    });
    editor.on('redo', () => {
        history.redo();
    });

    const onKeyDown = (event) => {
        const key = event.key;

        if(event.ctrlKey || event.metaKey) {
            if(key === 'z') {
                editor.trigger(event.shiftKey ? 'redo' : 'undo');
            }
            if(key === 'y') {
                editor.trigger('redo');
            }
        }
    };
    document.addEventListener('keydown', onKeyDown);
    editor.on('destroy', () => document.removeEventListener('keydown', onKeyDown));
}

const HistoryPlugin = {
    name: 'history',
    install,
};
export default HistoryPlugin;