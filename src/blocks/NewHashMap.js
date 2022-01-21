import {
    blobType,
    mapType,
    nat32Type,
    principalType,
    textType,
    typeType,
    unionType,
    valueType,
} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';
import {collectionCategory} from '../block-categories/categories';
import {FOR_STORING_DATA} from '../editor/useCases';

export const hashMapImportRef = importRef('mo:base/HashMap');
const getKeyImportRef = (type) => importRef(`mo:base/${type.name}`);

const block = {
    title: 'Create Map',
    info: 'Construct an empty HashMap',
    useCases: [FOR_STORING_DATA],
    category: collectionCategory,
    icon: collectionCategory.data.icon,
    topRight: 'value',
    computeTitle(node, editor) {
        let type = editor.compilers.type.getOutput(node, 'value');//?.generics[0];
        return type && `new HashMap<${editor.compilers.motoko.getTypeString(type.generics[0])}, ${editor.compilers.motoko.getTypeString(type.generics[1])}>`;
    },
    inputs: [{
        key: 'keyType',
        type: unionType.of(textType, principalType, blobType, nat32Type),
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
            let keyImportRef = getKeyImportRef(keyType);
            let keyTypeString = compiler.getTypeString(keyType);
            let valueTypeString = compiler.getTypeString(valueType);
            let hashFunction = keyType === nat32Type
                ? 'func (x) {x}'
                : `${keyImportRef}.hash`;
            return `${hashMapImportRef}.HashMap<${keyTypeString}, ${valueTypeString}>(0, ${keyImportRef}.equal, ${hashFunction})`;
        },
    }],
};
export default block;
