import {mapType, textType, typeType, valueType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';
import {collectionCategory} from '../block-categories/categories';

export const hashMapImportRef = importRef('mo:base/HashMap');
export const textImportRef = importRef('mo:base/Text');

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
        type: typeType.of(textType), // TODO: other key types
    }, {
        key: 'valueType',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'value',
        type: mapType,
        inferType({valueType}) {
            return mapType.of(textType, valueType);
        },
        toMotoko(args, node, compiler) {
            let {valueType} = compiler.editor.compilers.type.getInputArgs(node);
            let valueTypeString = compiler.getTypeString(valueType);
            return `${hashMapImportRef}.HashMap<Text, ${valueTypeString}>(0, ${textImportRef}.equal, ${textImportRef}.hash)`;
        },
    }],
};
export default block;
