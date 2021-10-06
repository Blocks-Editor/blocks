import * as Rete from 'rete';
import TextControlHandle from '../../components/rete/controls/TextControlHandle';
import EventEmitter from 'events';

export default class BaseControl extends Rete.Control {
    constructor(emitter, key, config) {
        super(key);

        config = config || {};

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
        return this.getData(this.key);
    }

    async setValue(value) {
        this.putData(this.key, value);
        // this.emitter.trigger('process');
        // await this.emitter._engine.abort();
        // await this.emitter._engine.process(this.emitter.toJSON()); //temp
        this.events.emit('update', value);
    }
}
