import * as Rete from 'rete';
import TextControlHandle from '../../components/rete/controls/TextControlHandle';
import EventEmitter from 'events';
import {bindNodeInput} from '../../utils/bindNodeInput';
import TypeControlHandle from '../../components/rete/controls/TypeControlHandle';
import NodeControlHandle from '../../components/rete/controls/NodeControlHandle';
import CheckboxControlHandle from '../../components/rete/controls/CheckboxControlHandle';
import NumberControlHandle from '../../components/rete/controls/NumberControlHandle';

// TODO: static assertions
const controlTypes = {
    text: TextControlHandle,
    number: NumberControlHandle,
    checkbox: CheckboxControlHandle,
    node: NodeControlHandle,
    type: TypeControlHandle,
};

export default class BaseControl extends Rete.Control {
    constructor(editor, key, name, config = {}) {
        super(key);

        this.name = name;
        this.config = config;
        this.editor = editor;
        this.render = 'react';
        this.component = (typeof config.controlType === 'string' ? controlTypes[config.controlType] : config.controlType) || TextControlHandle;
        this.props = {
            ...config.controlProps,
            validation: config.validation || {},
            control: this,
            editor,
            bindInput: bindNodeInput,
        };

        this.events = new EventEmitter();
    }

    validate(value) {
        if(value === undefined && !this.config.optional) {
            return false;
        }
        if(value !== null && value !== undefined) {
            let validation = this.config.validation;
            if(validation) {
                if('custom' in validation && !validation.custom(value)) {
                    return false;
                }
                if('minLength' in validation && value.length < validation.minLength) {
                    return false;
                }
                if('maxLength' in validation && value.length > validation.maxLength) {
                    return false;
                }
                if('min' in validation && value < validation.min) {
                    return false;
                }
                if('max' in validation && value > validation.max) {
                    return false;
                }
                if('step' in validation && value - (validation.min || 0) % validation.step !== 0) {
                    return false;
                }
                if('pattern' in validation && !validation.pattern.test(value)) {
                    return false;
                }
            }
        }
        return true;
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
