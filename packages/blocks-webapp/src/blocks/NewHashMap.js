import {typeCategory} from '../block-categories/categories';
import {mapType, typeType, valueType} from '../block-types/types';
import {importRef} from '../compilers/MotokoCompiler';

const block = {
    title: 'Hash Map',
    // category: mapCategory,
    topRight: 'value',
    inputs: [{
        key: 'keyType',
        title: 'Keys',
        type: typeType.of(valueType),
    }, {
        key: 'valueType',
        title: 'Values',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'value',
        type: mapType,
        control: true,
        inferType({keyType, valueType}) {
            return mapType.of(keyType, valueType);
        },
        toMotoko({keyType, valueType}) {
            return `${importRef('HashMap')}.HashMap<${keyType}, ${valueType}>(0, ${keyType}, ${valueType})`;
        },
    }],
};
export default block;
