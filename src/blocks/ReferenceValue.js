import {referenceType, typeType, valueType} from '../block-types/types';
import {FOR_CUSTOM_LOGIC, FOR_STORING_DATA} from '../editor/useCases';
import {referenceCategory} from '../block-categories/categories';

const block = {
    info: 'Convert a code reference to a typed value',
    category: referenceCategory,
    useCases: [FOR_CUSTOM_LOGIC, FOR_STORING_DATA],
    topLeft: 'reference',
    topRight: 'value',
    computeTitle(node, editor) {
        const type = editor.compilers.type.getInput(node, 'type');
        if(!type) {
            return;
        }
        return editor.compilers.motoko.getTypeString(type);
    },
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
