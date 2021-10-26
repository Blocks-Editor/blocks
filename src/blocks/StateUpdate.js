import {statementBlock} from '../block-patterns/statement-patterns';
import NodeControlHandle from '../components/rete/controls/NodeControlHandle';
import {stateCategory} from '../block-categories/categories';
import {FaAngleDoubleRight} from 'react-icons/all';

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
        config: {
            controlType: NodeControlHandle,
            controlProps: {
                component: 'State',
            },
        },
    }],
}, ({stateNode, value}, node, compiler) => {
    let name = compiler.getOutput(stateNode, 'name');
    if(!name) {
        return;
    }
    return `${name} := ${value};`;
});
export default block;
