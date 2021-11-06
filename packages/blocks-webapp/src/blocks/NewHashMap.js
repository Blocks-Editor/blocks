import {mapType, textType, typeType, valueType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';
import {collectionCategory} from '../block-categories/categories';

export const hashMapImportRef = importRef('mo:base/HashMap');

const block = {
    title: 'Create Map',
    category: collectionCategory,
    icon: collectionCategory.data.icon,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');//?.generics[0];
        return type && `new HashMap<${editor.compilers.motoko.getTypeString(type.generics[0])}, ${editor.compilers.motoko.getTypeString(type.generics[1])}>`;
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
        toMotoko(args, node, compiler) {
            let {keyType, valueType} = compiler.editor.compilers.type.getInputArgs(node);
            let keyTypeString = compiler.getTypeString(keyType);
            let valueTypeString = compiler.getTypeString(valueType);
            return `${hashMapImportRef}.HashMap<${keyTypeString}, ${valueTypeString}>(0, ${keyTypeString}.equal, ${valueTypeString}.hash)`;
        },
    }],
};
export default block;
