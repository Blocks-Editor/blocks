import BaseControl from './BaseControl';

export default class TypeControl extends BaseControl {
    constructor(emitter, key, name, socket) {
        super(emitter, key, name, socket.data);
    }

    getDefaultValue() {
        let value = super.getDefaultValue();
        return value !== undefined ? value : this.config.type.getDefaultValue();
    }
}