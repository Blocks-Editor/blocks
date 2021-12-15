import {arrayType, boolType, mutableArrayType, typeType, valueType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';
import {collectionCategory} from '../block-categories/categories';
import {FOR_STORING_DATA} from '../editor/useCases';

export const arrayImportRef = importRef('mo:base/Array');

const block = {
    title: 'Create Array',
    useCases: [FOR_STORING_DATA],
    category: collectionCategory,
    icon: collectionCategory.data.icon,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');
        let mutable = editor.compilers.motoko.getOutput(node, 'mutable'); // TODO: control compiler?
        return type && `new Array [ ${mutable ? 'var ' : ''}${editor.compilers.motoko.getTypeString(type.generics[0])} ]`;
    },
    inputs: [{
        key: 'itemType',
        type: typeType.of(valueType),
    }, {
        key: 'items',
        type: valueType,
        multi: true,
    }],
    outputs: [{
        key: 'value',
        type: arrayType,
        inferType({itemType}, node, compiler) {
            let mutable = compiler.editor.compilers.motoko.getInput(node, 'mutable'); // TODO: simplify
            return (mutable ? mutableArrayType : arrayType).of(itemType);
        },
        toMotoko({mutable, items}) {
            return `[${mutable ? (items.length ? 'var ' : 'var') : ''}${items.join(', ')}]`;
        },
    }],
    controls: [{
        key: 'mutable',
        type: boolType,
    }],
};
export default block;
