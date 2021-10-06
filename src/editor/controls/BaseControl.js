import * as Rete from 'rete';
import TextControlHandle from '../../components/rete/controls/TextControlHandle';
import EventEmitter from 'events';

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
            ...config.controlProps,
        };

        this.events = new EventEmitter();
    }

    getValue() {
        let value = this.getData(this.key);
        if(value === undefined) {
            return this.config.defaultValue;
        }
        return value;
    }

    setValue(value) {
        this.putData(this.key, value);
        this.events.emit('update', value);
    }
}
