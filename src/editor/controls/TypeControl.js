import BaseControl from './BaseControl';

export default class TypeControl extends BaseControl {
    constructor(emitter, key, name, socket) {
        super(emitter, key, name, socket.data);
    }

    getDefaultValue() {
        // :: collision between socket type config and prop config
        // let value = super.getDefaultValue();
        // return value !== undefined ? value : this.config.type.getDefaultValue();

        return this.config.type.getDefaultValue()
    }
}