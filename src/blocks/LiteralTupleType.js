import {typeCategory} from '../block-categories/categories';
import {tupleType, typeType, valueType} from '../block-types/types';

const block = {
    title: 'Tuple of Types',
    category: typeCategory,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');//?.generics[0];
        return type && editor.compilers.motoko.getTypeString(type);
    },
    inputs: [{
        key: 'types',
        type: typeType.of(valueType),
        multi: true,
    }],
    outputs: [{
        key: 'value',
        type: typeType.of(tupleType),
        inferType({types}) {
            return /*typeType.of(*/tupleType.of(...types/*.map(t => t.generics[0])*/)/*)*/; // Unwrap Type<?> inputs
        },
    }],
};
export default block;
