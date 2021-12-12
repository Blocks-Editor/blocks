import SelectControlHandle from '../components/rete/controls/SelectControlHandle';
import {boolType} from '../block-types/types';

export function stringSelectProp(prop, options) {
    options = prop.optional ? [undefined, ...options] : options;
    return {
        ...prop,
        config: {
            ...prop.config || {},
            controlType: SelectControlHandle,
            controlProps: {
                options,
                findLabel: (option) => option ? option.charAt(0).toUpperCase() + option.substring(1) : '--',
            },
            controlDefault: options[0],
        },
    };
}

export function advancedProp() {
    return {
        key: 'editor:advanced',
        title: 'Advanced',
        type: boolType,
        config: {
            onChange(control) {
                control.editor.updateNode(control.getNode());
            },
        },
    };
}