import BaseControl from './BaseControl';

export default class PropControl extends BaseControl {
    constructor(emitter, prop, name, socket) {
        super(emitter, prop.key, name, socket.data);

        // this.prop = prop;
    }

    getDefaultValue() {
        // :: collision between socket type config and prop config
        // let value = super.getDefaultValue();
        // return value !== undefined ? value : this.config.type.getDefaultValue();

        return this.config.type.getDefaultValue();
    }
}