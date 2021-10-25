import {statementBlock} from '../block-patterns/statement-patterns';
import NodeControlHandle from '../components/rete/controls/NodeControlHandle';
import {valueType} from '../block-types/types';
import {FaPlayCircle} from 'react-icons/all';
import {functionCategory} from '../block-categories/categories';

const block = statementBlock({
    title: 'Call Function',
    category: functionCategory,
    icon: FaPlayCircle,
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
