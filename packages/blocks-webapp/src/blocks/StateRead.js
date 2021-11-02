import {nodeType, valueType} from '../block-types/types';
import {stateCategory} from '../block-categories/categories';
import {FaAngleRight} from 'react-icons/fa';

const block = {
    title: 'Read State',
    category: stateCategory,
    icon: FaAngleRight,
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: valueType,
        inferType(args, node, compiler) {
            let stateNode = compiler.editor.compilers.node.getInput(node, 'stateNode');
            return compiler.getOutput(stateNode, 'initialValue');
        },
        toMotoko({stateNode, value}, node, compiler) {
            return compiler.getOutput(stateNode, 'name');
        },
    }],
    controls: [{
        key: 'stateNode',
        type: nodeType.withMeta({block: 'State'}),
    }],
};
export default block;
