import {typeCategory} from '../block-categories/categories';
import {tupleType, typeType, valueType} from '../block-types/types';

const block = {
    title: 'Pair of Types',
    info: 'An ordered pair of two types',
    category: typeCategory,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');//?.generics[0];
        return type && editor.compilers.motoko.getTypeString(type);
    },
    inputs: [{
        key: 'left',
        title: 'a',
        type: typeType.of(valueType),
    }, {
        key: 'right',
        title: 'b',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'value',
        type: typeType.of(tupleType.of(valueType, valueType)),
        inferType({left, right}) {
            return /*typeType.of(*/tupleType.of(left, right)/*)*/;
        },
    }],
};
export default block;
