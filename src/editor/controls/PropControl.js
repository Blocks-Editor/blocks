import BaseControl from './BaseControl';

export default class PropControl extends BaseControl {
    constructor(editor, prop, name) {
        super(editor, prop.key, name, {
            ...prop.type?.data || {},
            ...prop.config || {},
            prop,
            type: prop.type,
            optional: prop.optional,
        });
    }

    getDefaultValue() {
        // let value = super.getDefaultValue();
        // return value !== undefined ? value : this.config.type?.getDefaultValue();

        if('controlDefault' in this.config) {
            return this.config.controlDefault;
        }

        return this.config.type?.getDefaultValue();
    }

    getValue() {
        let value = super.getValue();
        if(this.config.type?.fromJSON) {
            value = this.config.type.fromJSON(value, this);
        }
        return value;
    }
}