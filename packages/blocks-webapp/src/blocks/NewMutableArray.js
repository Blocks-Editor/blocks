import {mutableArrayType, typeType, valueType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';
import {collectionCategory} from '../block-categories/categories';

export const arrayImportRef = importRef('mo:base/Array');

const block = {
    title: 'Create Array',
    category: collectionCategory,
    icon: collectionCategory.data.icon,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');
        return type && `new Array [ ${editor.compilers.motoko.getTypeString(type.generics[0])} ]`;
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
        type: mutableArrayType,
        inferType({itemType}) {
            return mutableArrayType.of(itemType);
        },
        toMotoko({items}) {
            return items.length ? `[var ${items.join(', ')}]` : `[var]`;
        },
    }],
};
export default block;
