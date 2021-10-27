import {typeType, valueType} from '../block-types/types';
import {typeCategory} from '../block-categories/categories';
import {FaAngleRight} from 'react-icons/all';
import NodeControlHandle from '../components/rete/controls/NodeControlHandle';

const block = {
    title: 'Type Reference',
    category: typeCategory,
    icon: FaAngleRight,
    topRight: 'type',
    computeTitle(node, editor) {
        let typeNode = editor.compilers.node.getInput(node, 'typeNode');
        if(!typeNode) {
            return;
        }
        return editor.compilers.motoko.getInput(typeNode, 'name');
    },
    outputs: [{
        key: 'type',
        type: typeType.of(valueType),
        inferType({typeNode}, node, editor) {
            return editor.compilers.types.getInput(typeNode, 'type');
        },
    }],
    controls: [{
        key: 'typeNode',
        config: {
            controlType: NodeControlHandle,
            controlProps: {
                component: 'TypeMember',
            },
        },
    }],
};
export default block;
