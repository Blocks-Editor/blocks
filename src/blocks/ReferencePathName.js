import {identifierType, referenceType} from '../block-types/types';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {referenceCategory} from '../block-categories/categories';

const block = {
    title: 'Path (a.b)',
    info: 'Refer to a child of the specified reference',
    category: referenceCategory,
    useCases: [FOR_CUSTOM_LOGIC],
    topLeft: 'parent',
    topRight: 'reference',
    inputs: [{
        key: 'parent',
        type: referenceType,
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
