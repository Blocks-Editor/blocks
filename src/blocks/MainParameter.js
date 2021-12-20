import {identifierType, typeType, valueType} from '../block-types/types';
import {paramCategory} from '../block-categories/categories';
import {FOR_CONFIGURATION} from '../editor/useCases';

export function compileGlobalParameter(node, compiler) {
    let {name, type} = compiler.getInputArgs(node);
    let typeString = compiler.getTypeString(type) || 'Any';
    return `${name} : ${typeString}`;
}

const block = {
    info: 'A top-level input parameter to the smart contract',
    useCases: [FOR_CONFIGURATION],
    topRight: 'value',
    category: paramCategory,
    global: true,
    computeTitle(node, editor) {
        let name = editor.compilers.motoko.getInput(node, 'name');
        let type = editor.compilers.type.getInput(node, 'type');
        return name && `${name} : ${type ? editor.compilers.motoko.getTypeString(type) : 'Any'}`;
    },
    shortcuts: [{
        block: 'MainParameterRead',
        nodeKey: 'configNode',
    }],
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'type',
        type: typeType.of(valueType),
    }],
    outputs: [{
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