import {statementBlock} from '../block-patterns/statement-patterns';
import {nodeType, valueType} from '../block-types/types';
import {FaPlayCircle} from 'react-icons/fa';
import {functionCategory} from '../block-categories/categories';
import {getFunctionReturnType} from './Function';
import {FOR_REUSABLE_LOGIC} from '../editor/useCases';
import {findNodeSearchOptions} from '../block-patterns/search-patterns';
import {formatParentheses} from '../editor/format/formatHelpers';

const block = statementBlock({
    info: 'Invoke a function in this project',
    title: 'Call Function',
    useCases: [FOR_REUSABLE_LOGIC],
    category: functionCategory,
    icon: FaPlayCircle,
    computeTitle(node, editor) {
        let functionNode = editor.compilers.node.getInput(node, 'functionNode');
        if(!functionNode) {
            return;
        }
        let name = editor.compilers.motoko.getInput(functionNode, 'name');
        let paramNames = editor.compilers.connection.getInput(functionNode, 'params')
            .map(n => editor.compilers.motoko.getInput(n, 'name'));
        return name && `${name}${formatParentheses(paramNames.join(', '))}`;
    },
    customSearch(text, {editor}) {
        return findNodeSearchOptions(text, editor, 'Function', 'functionNode');
    },
    inputs: [{
        key: 'args',
        title: 'Inputs',
        type: valueType,
        multi: true, // TODO: separate arg sockets
    }],
    outputs: [{
        key: 'value',
        title: 'Result',
        info: 'Call the function and output the result',
        type: valueType,
        inferType(_, node, compiler) {
            let functionNode = compiler.editor.compilers.node.getInput(node, 'functionNode');
            if(!functionNode) {
                return;
            }
            return getFunctionReturnType(functionNode, compiler.editor);
        },
        toMotoko({args}, node, compiler) {
            let functionNode = compiler.editor.compilers.node.getInput(node, 'functionNode');
            if(!functionNode) {
                return;
            }
            let name = compiler.getInput(functionNode, 'name');
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
    let name = compiler.getInput(functionNode, 'name');
    if(!name) {
        return;
    }
    return `ignore ${name}${formatParentheses(args.join(', '))};`;
});
export default block;
