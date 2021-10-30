import {statementBlock} from '../block-patterns/statement-patterns';
import {nodeType, valueType} from '../block-types/types';
import {FaPlayCircle} from 'react-icons/fa';
import {functionCategory} from '../block-categories/categories';

const block = statementBlock({
    title: 'Call Function',
    category: functionCategory,
    icon: FaPlayCircle,
    computeTitle(node, editor) {
        let functionNode = editor.compilers.node.getInput(node, 'functionNode');
        if(!functionNode) {
            return;
        }
        let name = editor.compilers.motoko.getInput(functionNode, 'name');
        let paramNames = editor.compilers.node.getInput(functionNode, 'params')
            .map(n => editor.compilers.motoko.getInput(n, 'name'));
        return name && `${name}(${paramNames.join(', ')})`;
    },
    inputs: [{
        key: 'args',
        type: valueType,
        multi: true, // TODO: separate arg sockets
    }],
    outputs: [{
        key: 'value',
        type: 'Value',
        toMotoko({functionNode, args}, node, compiler) {
            let name = compiler.getOutput(functionNode, 'name');
            if(!name) {
                return;
            }
            return `${name}(${args.join(', ')})`;
        },
    }],
    controls: [{
        key: 'functionNode',
        type: nodeType.withMeta({block: 'Function'}),
    }],
}, ({functionNode, args}, node, compiler) => {
    let name = compiler.getOutput(functionNode, 'name');
    if(!name) {
        return;
    }
    return `ignore ${name}(${args.join(', ')});`;
});
export default block;
