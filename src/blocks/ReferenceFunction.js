import {functionType, referenceType, tupleType, typeType, valueType} from '../block-types/types';
import {FOR_CUSTOM_LOGIC, FOR_REUSABLE_LOGIC} from '../editor/useCases';
import {referenceCategory} from '../block-categories/categories';

const block = {
    title: 'Function',
    info: 'Convert a code reference to a typed function',
    category: referenceCategory,
    icon: referenceCategory.data.icon,
    useCases: [FOR_CUSTOM_LOGIC, FOR_REUSABLE_LOGIC],
    topLeft: 'reference',
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getInput(node, 'value');
        if(!type) {
            return;
        }
        return editor.compilers.motoko.getTypeString(type);
    },
    inputs: [{
        key: 'reference',
        type: referenceType,
    }, {
        key: 'paramTypes',
        title: 'Input types',
        type: typeType.of(valueType),
        multi: true,
    }, {
        key: 'returnType',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'value',
        title: 'Function',
        type: functionType,
        toMotoko({reference}) {
            return reference;
        },
        inferType({paramTypes, returnType}) {
            if(!returnType) {
                return;
            }
            return functionType.of(tupleType.of(...paramTypes), returnType);
        },
    }],
};
export default block;
