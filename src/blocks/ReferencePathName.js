import {identifierType, referenceType, textType} from '../block-types/types';

const block = {
    title: 'Path',
    // category: defaultCategory,
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
