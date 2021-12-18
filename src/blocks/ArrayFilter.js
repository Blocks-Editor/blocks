import {arrayType, boolType, effectType, unitType, valueType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {FaLayerGroup} from 'react-icons/fa';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {arrayImportRef} from './NewArray';
import {formatCurlyBraces} from '../editor/format/formatHelpers';

const block = {
    title: 'Filter Items (Array)',
    category: collectionCategory,
    icon: FaLayerGroup,
    topRight: 'result',
    inputs: [{
        key: 'array',
        type: arrayType,
    }, {
        key: 'body',
        title: 'Filter',
        type: effectType.of(boolType),
    }],
    outputs: [{
        key: 'result',
        type: arrayType,
        inferType({array}) {
            return array;
        },
        toMotoko({array, body}, node, compiler) {
            let type = array?.generics[0] || unitType;
            let typeString = compiler.getTypeString(type);

            return `${arrayImportRef}.filter<${typeString}>(${array}, func (${nodeIdentifierRef(node)} : ${typeString}) : Bool ${formatCurlyBraces(body)})`;
        },
    }, {
        key: 'item',
        type: valueType,
        inferType({array}) {
            if(arrayType.isSubtype(array)) {
                return array.generics[0];
            }
        },
        toMotoko(_, node, compiler) {
            return nodeIdentifierRef(node);
        },
    }],
};
export default block;
