import {referenceType, typeType, valueType} from '../block-types/types';
import {FOR_CUSTOM_LOGIC} from '../editor/useCases';
import {referenceCategory} from '../block-categories/categories';

const block = {
    info: 'Convert a code reference to a typed value',
    category: referenceCategory,
    useCases: [FOR_CUSTOM_LOGIC],
    topLeft: 'reference',
    topRight: 'value',
    inputs: [{
        key: 'reference',
        type: referenceType,
    }, {
        key: 'type',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        toMotoko({reference}) {
            return reference;
        },
        inferType({type}) {
            return type;
        },
    }],
};
export default block;
