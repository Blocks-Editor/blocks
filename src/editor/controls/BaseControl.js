import * as Rete from 'rete';
import TextFieldControlHandle from '../../components/rete/controls/TextFieldControlHandle';

export default class BaseControl extends Rete.Control {
    constructor(emitter, key, config) {
        super(key);

        config = config || {};

        this.emitter = emitter;
        this.render = 'react';
        this.component = config.control || TextFieldControlHandle;
        this.props = {
            control: this,
        };
    }

    getValue() {
        return this.getData(this.key);
    }

    setValue(value) {
        this.putData(this.key, value);
        this.emitter.trigger('process');//
    }
}