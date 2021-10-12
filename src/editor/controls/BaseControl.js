import * as Rete from 'rete';
import TextControlHandle from '../../components/rete/controls/TextControlHandle';
import EventEmitter from 'events';

// Enable selecting input fields without dragging node
const bindInput = ref => ref && ref.addEventListener('pointerdown', event => event.stopPropagation());

export default class BaseControl extends Rete.Control {
    constructor(emitter, key, config = {}) {
        super(key);

        this.config = config;
        this.emitter = emitter;
        this.render = 'react';
        this.component = config.controlType || TextControlHandle;
        this.props = {
            emitter,
            control: this,
            bindInput,
            ...config.controlProps,
        };

        this.events = new EventEmitter();
    }

    getDefaultValue() {
        return undefined;
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
