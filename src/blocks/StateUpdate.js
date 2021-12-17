import {statementBlock} from '../block-patterns/statement-patterns';
import {stateCategory} from '../block-categories/categories';
import {nodeType} from '../block-types/types';
import {stateWriteIcon} from './State';
import {FOR_STORING_DATA} from '../editor/useCases';

const block = statementBlock({
    title: 'Write State',
    info: 'Set the value of a state',
    useCases: [FOR_STORING_DATA],
    category: stateCategory,
    icon: stateWriteIcon,
    inputs: [{
        key: 'value',
        type: 'Value',
        // optional: true,
    }],
    // outputs: [{
    //     key: 'newValue',
    //     type: 'Value',
    //     toMotoko({node: stateNode, value}, node, compiler) {
    //         let name = compiler.getOutput(stateNode, 'name');
    //         if(!name) {
    //             return;
    //         }
    //         return `(${name} := ${value || '()'})`;
    //     },
    // }],
    controls: [{
        key: 'stateNode',
        type: nodeType.withMeta({block: 'State'}),
    }],
}, ({stateNode, value}, node, compiler) => {
    let name = compiler.getInput(stateNode, 'name');
    if(!name) {
        return;
    }
    return `${name} := ${value};`;
});
export default block;
