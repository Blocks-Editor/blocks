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

    // Called every EDITOR_CHANGE_EVENT when control is visible
    notifyEditorChange() {
        // this.config.prop.onUpdateControl?.(this, this.getNode(), this.editor);
    }
}