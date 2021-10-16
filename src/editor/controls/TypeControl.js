import BaseControl from './BaseControl';

export default class TypeControl extends BaseControl {
    constructor(emitter, key, socket) {
        super(emitter, key, socket.data);
    }

    getDefaultValue() {
        let value = super.getDefaultValue();
        return value !== undefined ? value : this.config.type.getDefaultValue();
    }
}