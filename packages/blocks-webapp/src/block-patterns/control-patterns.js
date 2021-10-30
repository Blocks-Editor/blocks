import SelectControlHandle from '../components/rete/controls/SelectControlHandle';

export function stringSelectProp(prop, options) {
    return {
        ...prop,
        config: {
            ...prop.config || {},
            controlType: SelectControlHandle,
            controlProps: {
                options: prop.optional ? [undefined, ...options] : options,
                findLabel: (option) => option ? option.charAt(0).toUpperCase() + option.substring(1) : '--',
            },
        },
    };
}