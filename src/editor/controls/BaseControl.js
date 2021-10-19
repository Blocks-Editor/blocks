import * as Rete from 'rete';
import TextControlHandle from '../../components/rete/controls/TextControlHandle';
import EventEmitter from 'events';

// Enable selecting input fields without dragging node
const bindInput = ref => ref && ref.addEventListener('pointerdown', event => event.stopPropagation());

export default class BaseControl extends Rete.Control {
    constructor(editor, key, name, config = {}) {
        super(key);

        this.name = name;
        this.config = config;
        this.editor = editor;
        this.render = 'react';
        this.component = config.controlType || TextControlHandle;
        this.props = {
            ...config.controlProps,
            control: this,
            editor,
            bindInput,
        };

        this.events = new EventEmitter();
    }

    getDefaultValue() {
        // return this.config.defaultValue;
    }

    getValue() {
        let value = this.getData(this.key);
        return value === undefined ? this.getDefaultValue() : value;
    }

    setValue(value) {
        this.putData(this.key, value);
        this.events.emit('update', value);
    }
}
