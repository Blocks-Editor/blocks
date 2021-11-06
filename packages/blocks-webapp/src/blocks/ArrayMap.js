import {arrayType, effectType, optionalType, unitType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {FaLayerGroup} from 'react-icons/all';
import {nodeVariableRef} from '../compilers/MotokoCompiler';
import {arrayImportRef} from './NewArray';

const block = {
    title: 'Replace Items (Array)',
    category: collectionCategory,
    icon: FaLayerGroup,
    topRight: 'value',
    inputs: [{
        key: 'array',
        type: arrayType,
    }, {
        key: 'body',
        title: 'Replace',
        type: effectType,
    }],
    outputs: [{
        key: 'item',
        type: optionalType,
        inferType({array}) {
            if(arrayType.isSubtype(array)) {
                return array.generics[0];
            }
        },
        toMotoko(_, node, compiler) {
            return nodeVariableRef(node);
        },
    }, {
        key: 'value',
        type: arrayType,
        inferType({body}) {
            return arrayType.of();
        },
        toMotoko({array, body}, node, compiler) {
            let fromType = array.generics[0] || unitType;
            let toType = compiler.editor.compilers.type.getInput(node, 'body') || unitType;

            return `${arrayImportRef}.map<${fromType}, ${toType}>(${array}, func (${nodeVariableRef(node)}) { ${body} })`;
        },
    }],
};
export default block;
