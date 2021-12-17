import {nodeType, valueType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';
import {stateReadIcon} from './State';
import {FOR_CONFIGURATION} from '../editor/useCases';
import {findNodeSearchOptions} from '../block-patterns/search-patterns';

const block = {
    title: 'Read Config',
    info: 'Get a top-level configuration value',
    useCases: [FOR_CONFIGURATION],
    category: paramCategory,
    icon: stateReadIcon,
    topRight: 'value',
    customSearch(text, {editor}) {
        return findNodeSearchOptions(text, editor, 'GlobalParameter', 'configNode');
    },
    outputs: [{
        key: 'value',
        type: valueType,
        inferType(args, node, compiler) {
            let configNode = compiler.editor.compilers.node.getInput(node, 'configNode');
            if(!configNode) {
                return;
            }
            return compiler.getInput(configNode, 'type');
        },
        toMotoko(args, node, compiler) {
            let configNode = compiler.editor.compilers.node.getInput(node, 'configNode');
            if(!configNode) {
                return;
            }
            return compiler.getInput(configNode, 'name');
        },
    }],
    controls: [{
        key: 'configNode',
        type: nodeType.withMeta({block: 'GlobalParameter'}),
    }],
};
export default block;
