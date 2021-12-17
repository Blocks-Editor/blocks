import {nodeType, valueType} from '../block-types/types';
import {stateCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';
import {FOR_BUILDING_API} from '../editor/useCases';
import {findNodeSearchOptions} from '../block-patterns/search-patterns';

const block = {
    title: 'Read State',
    info: 'Get the current value of a state',
    useCases: [FOR_BUILDING_API],
    category: stateCategory,
    icon: stateReadIcon,
    topRight: 'value',
    customSearch(text, {editor}) {
        return findNodeSearchOptions(text, editor, 'State', 'stateNode');
    },
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
