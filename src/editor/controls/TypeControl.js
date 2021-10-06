import BaseControl from './BaseControl';

export default class TypeControl extends BaseControl {
    constructor(emitter, key, socket) {
        super(emitter, key, socket.data);

        // this.component = socket.data.control || TextFieldControlHandle;
    }
}