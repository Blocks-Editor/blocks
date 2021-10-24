import {identifierType, paramType, typeType, valueType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';

const block = {
    topLeft: 'param',
    // topRight: 'value',
    category: paramCategory,
    computeTitle(node, editor) {
        let name = editor.compilers.motoko.getInput(node, 'name');
        let type = editor.compilers.type.getInput(node, 'param');
        return name && `${name}: ${type ? editor.compilers.motoko.getTypeString(type) : 'Any'}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
    }],
    outputs: [{
        key: 'param',
        type: paramType,
        toMotoko({name, type}, node, compiler) {
            // console.log(type)//
            let typeString = compiler.getTypeString(type) || 'Any';
            return `${name}: ${typeString}`;
        },
    }, {
        key: 'value',
        type: valueType,
        toMotoko({name}) {
            return name;
        },
        inferType({type}) {
            return type;
        },
    }],
    controls: [{
        key: 'type',
        type: typeType.of(valueType),
    }],
};
export default block;