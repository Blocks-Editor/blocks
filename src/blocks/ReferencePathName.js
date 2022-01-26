import {identifierType, referenceType, textType} from '../block-types/types';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';

const block = {
    title: 'Path (a.b)',
    info: 'Refer to a child of the specified reference',
    // category: defaultCategory,
    useCases: [FOR_CUSTOM_LOGIC],
    topRight: 'reference',
    inputs: [{
        key: 'parent',
        type: textType,
        config: {
            validation: {
                minLength: 1,
            },
        },
    }],
    outputs: [{
        key: 'reference',
        type: referenceType,
        toMotoko({parent, name}) {
            return `${parent}.${name}`;
        },
    }],
    controls: [{
        key: 'name',
        type: identifierType,
        config: {
            validation: {
                minLength: 1,
            },
        },
    }],
};
export default block;
