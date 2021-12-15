import {identifierType, paramType, typeType, valueType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';
import {FOR_REUSABLE_LOGIC} from '../editor/useCases';

const block = {
    info: 'An input parameter to a class or function',
    useCases: [FOR_REUSABLE_LOGIC],
    topLeft: 'param',
    topRight: 'value',
    category: paramCategory,
    computeTitle(node, editor) {
        let name = editor.compilers.motoko.getInput(node, 'name');
        let type = editor.compilers.type.getInput(node, 'type');
        return name && `${name} : ${type ? editor.compilers.motoko.getTypeString(type) : 'Any'}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'type',
        type: typeType.of(valueType),
    }],
    outputs: [{
        key: 'param',
        type: paramType,
        toMotoko({name, type}, node, compiler) {
            // console.log(type)//
            let typeString = compiler.getTypeString(type) || 'Any';
            return `${name} : ${typeString}`;
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
};
export default block;