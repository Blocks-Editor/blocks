import {statementBlock} from '../block-patterns/statement-patterns';
import {stateCategory} from '../block-categories/categories';
import {FaAngleDoubleRight} from 'react-icons/all';
import {nodeType} from '../block-types/types';
import State from './State';

const block = statementBlock({
    title: 'Write State',
    category: stateCategory,
    icon: FaAngleDoubleRight,
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
    let name = compiler.getOutput(stateNode, 'name');
    if(!name) {
        return;
    }
    return `${name} := ${value};`;
});
export default block;
