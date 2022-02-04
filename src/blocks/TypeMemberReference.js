import {nodeType, typeType, valueType} from '../block-types/types';
import {typeCategory} from '../block-categories/categories';
import {FaAngleRight} from 'react-icons/fa';
import {findNodeSearchOptions} from '../block-patterns/search-patterns';

const block = {
    title: 'Get Named Type',
    info: 'Reference a global named type',
    category: typeCategory,
    icon: FaAngleRight,
    topRight: 'type',
    // hidden: true,////
    customSearch(text, {editor}) {
        return findNodeSearchOptions(text, editor, 'TypeMember', 'typeNode');
    },
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
        inferType(args, node, compiler) {
            let typeNode = compiler.editor.compilers.node.getInput(node, 'typeNode');
            if(!typeNode) {
                return;
            }
            return compiler.editor.compilers.type.getInput(typeNode, 'type');
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
