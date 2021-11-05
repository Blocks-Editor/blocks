import {typeCategory} from '../block-categories/categories';
import {tupleType, valueType} from '../block-types/types';

const block = {
    title: 'Pair',
    category: typeCategory,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');//?.generics[0];
        return type && `Pair ${editor.compilers.motoko.getTypeString(type)}`;
    },
    inputs: [{
        key: 'left',
        title: 'a',
        type: valueType,
    }, {
        key: 'right',
        title: 'b',
        type: valueType,
    }],
    outputs: [{
        key: 'value',
        type: tupleType.of(valueType, valueType),
        inferType({left, right}) {
            return tupleType.of(left, right);
        },
        toMotoko({left, right}) {
            return `(${left}, ${right})`;
        },
    }],
};
export default block;
