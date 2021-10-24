import NodeControlHandle from '../components/rete/controls/NodeControlHandle';
import {valueType} from '../block-types/types';
import {readStateCategory} from '../block-categories/categories';

const block = {
    title: 'Read State',
    category: readStateCategory,
    showIcon: true,//
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({stateNode}, node, compiler) {
            return compiler.getOutput(stateNode, 'initialValue');
        },
        toMotoko({stateNode, value}, node, compiler) {
            return compiler.getOutput(stateNode, 'name');
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
