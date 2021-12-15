import {nodeType, valueType} from '../block-types/types';
import {stateCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';
import {FOR_BUILDING_API} from '../editor/useCases';

const block = {
    title: 'Read State',
    useCases: [FOR_BUILDING_API],
    category: stateCategory,
    icon: stateReadIcon,
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: valueType,
        inferType(args, node, compiler) {
            let stateNode = compiler.editor.compilers.node.getInput(node, 'stateNode');
            if(!stateNode) {
                return;
            }
            return compiler.getInput(stateNode, 'initialValue');
        },
        toMotoko(args, node, compiler) {
            let stateNode = compiler.editor.compilers.node.getInput(node, 'stateNode');
            if(!stateNode) {
                return;
            }
            return compiler.getInput(stateNode, 'name');
        },
    }],
    controls: [{
        key: 'stateNode',
        type: nodeType.withMeta({block: 'State'}),
    }],
};
export default block;
