import NodeControlHandle from '../components/rete/controls/NodeControlHandle';
import {valueType} from '../block-types/types';

const block = {
    title: 'Get state',
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({stateNode}, node, compiler) {
            return compiler.getOutput(stateNode, '');
        },
        toMotoko({stateNode, value}, node, compiler) {
            let name = compiler.getOutput(stateNode, 'name');
            if(!name) {
                return;
            }
            return `${name}`;
        },
    }],
    controls: [{
        key: 'stateNode',
        config: {
            controlType: NodeControlHandle,
            controlProps: {
                component: 'State',
            },
        },
    }],
};
export default block;
