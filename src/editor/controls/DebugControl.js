import BaseControl from './BaseControl';
import TextFieldControlHandle from '../../components/rete/controls/TextFieldControlHandle';

export default class DebugControl extends BaseControl {
    constructor(...args) {
        super(...args);

        this.component = TextFieldControlHandle;
    }
}