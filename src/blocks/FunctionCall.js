import {statementBlock} from '../block-patterns/statement-patterns';
import NodeControlHandle from '../components/rete/controls/NodeControlHandle';
import {callFunctionCategory} from '../block-categories/categories';
import {valueType} from '../block-types/types';

const block = statementBlock({
    title: 'Call Function',
    category: callFunctionCategory,
    showIcon: true,//
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
        config: {
            controlType: NodeControlHandle,
            controlProps: {
                component: 'Function',
            },
        },
    }],
}, {
    toMotoko({functionNode, args}, node, compiler) {
        let name = compiler.getOutput(functionNode, 'name');
        if(!name) {
            return;
        }
        return `${name}(${args.join(', ')});`;
    },
});
export default block;
