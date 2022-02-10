import {statementBlock} from '../block-patterns/statement-patterns';
import {FaRecycle} from 'react-icons/fa';
import {FOR_DEBUGGING, FOR_TESTING} from '../editor/useCases';
import {stateCategory} from '../block-categories/categories';

const block = statementBlock({
    title: 'Reset States',
    info: 'Re-initialize all "State" and "Counter" blocks',
    category: stateCategory,
    icon: FaRecycle,
    useCases: [FOR_TESTING, FOR_DEBUGGING],
}, (args, node, compiler) => {
    return [
        ...compiler.editor.nodes
            .filter(node => node.name === 'State')
            .map(node => {
                const {name, initialValue} = compiler.getInputArgs(node);
                return `${name} := ${initialValue};`;
            }),
        ...compiler.editor.nodes
            .filter(node => node.name === 'CounterState')
            .map(node => {
                const {name} = compiler.getInputArgs(node);
                return `${name} := 0;`;
            }),
    ].join('\n');
});
export default block;
