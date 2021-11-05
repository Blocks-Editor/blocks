import {mapType, textType, typeType, valueType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';
import {collectionCategory} from '../block-categories/categories';

export const hashMapImportRef = importRef('mo:base/HashMap');

const block = {
    title: 'Map',
    category: collectionCategory,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');//?.generics[0];
        return type && `HashMap<${editor.compilers.motoko.getTypeString(type.generics[0])},${editor.compilers.motoko.getTypeString(type.generics[1])}>`;
    },
    inputs: [{
        key: 'keyType',
        type: typeType.of(valueType),
        config: {
            defaultValue: textType,
        },
    }, {
        key: 'valueType',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'value',
        type: mapType,
        inferType({keyType, valueType}) {
            return mapType.of(keyType, valueType);
        },
        toMotoko({keyType, valueType}) {
            return `${hashMapImportRef}.HashMap<${keyType}, ${valueType}>(0, ${keyType}.equal, ${valueType}.hash)`;
        },
    }],
};
export default block;
