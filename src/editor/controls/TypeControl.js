import BaseControl from './BaseControl';

export default class TypeControl extends BaseControl {
    constructor(editor, key, socket) {
        super(editor, key, socket.data);

        // this.component = socket.data.control || TextFieldControlHandle;
    }
}