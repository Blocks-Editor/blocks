import {literalCategory} from '../block-categories/categories';
import {tupleType, valueType} from '../block-types/types';

const block = {
    title: 'Tuple',
    info: 'Create a tuple value from the provided input values',
    category: literalCategory,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');//?.generics[0];
        return type && `Tuple ${editor.compilers.motoko.getTypeString(type)}`;
    },
    inputs: [{
        key: 'inputs',
        type: valueType,
        multi: true,
    }],
    outputs: [{
        key: 'value',
        type: tupleType,
        inferType({inputs}) {
            return tupleType.of(...inputs);
        },
        toMotoko({inputs}) {
            return `(${inputs.join(', ')})`;
        },
    }],
};
export default block;
