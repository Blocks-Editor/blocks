import {nodeType, typeType, valueType} from '../block-types/types';
import {typeCategory} from '../block-categories/categories';
import {FaAngleRight} from 'react-icons/fa';

const block = {
    title: 'Type Reference',
    category: typeCategory,
    icon: FaAngleRight,
    topRight: 'type',
    computeTitle(node, editor) {
        let typeNode = editor.compilers.node.getInput(node, 'typeNode');
        console.log(typeNode);
        if(!typeNode) {
            return;
        }
        return editor.compilers.motoko.getInput(typeNode, 'name');
    },
    outputs: [{
        key: 'type',
        type: typeType.of(valueType),
        inferType(args, node, compiler) {
            let typeNode = compiler.editor.compilers.node.getInput(node, 'typeNode');
            if(!typeNode) {
                return;
            }
            return compiler.editor.compilers.types.getInput(typeNode, 'type');
        },
        // toMotoko({name}) {
        //     return name;
        // },
    }],
    controls: [{
        key: 'typeNode',
        type: nodeType.withMeta({block: 'TypeMember'}),
    }],
};
export default block;
