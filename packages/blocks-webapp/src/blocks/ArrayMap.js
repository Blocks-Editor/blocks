import {arrayType, effectType, unitType, valueType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {FaLayerGroup} from 'react-icons/fa';
import {nodeIdentifierRef} from '../compilers/MotokoCompiler';
import {arrayImportRef} from './NewArray';

const block = {
    title: 'Replace Items (Array)',
    category: collectionCategory,
    icon: FaLayerGroup,
    topRight: 'body',
    inputs: [{
        key: 'array',
        type: arrayType,
    }, {
        key: 'body',
        title: 'Replace',
        type: effectType,
    }],
    outputs: [{
        key: 'result',
        type: arrayType,
        inferType({body}) {
            if(effectType.isSubtype(body)) {
                return arrayType.of(body.generics[0]);
            }
        },
        toMotoko({array, body}, node, compiler) {
            let fromType = array?.generics[0] || unitType;
            let toType = compiler.editor.compilers.type.getInput(node, 'body') || unitType;

            let fromTypeString = compiler.getTypeString(fromType);
            let toTypeString = compiler.getTypeString(toType);

            return `${arrayImportRef}.map<${fromTypeString}, ${toTypeString}>(${array}, func (${nodeIdentifierRef(node)} : ${fromTypeString}) : ${toTypeString} { ${body} })`;
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
