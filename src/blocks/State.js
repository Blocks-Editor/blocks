import {boolType, identifierType, unitType, valueType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';
import {stateCategory} from '../block-categories/categories';

const block = memberBlock({
    topRight: 'value',
    category: stateCategory,
    computeTitle(node, editor) {
        let name = editor.compilers.motoko.getInput(node, 'name');
        let type = editor.compilers.type.getInput(node, 'initialValue') || unitType;
        return name && `${name}: ${editor.compilers.motoko.getTypeString(type)}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        //     key: 'type',
        //     type: 'Type',
        // }, {
        key: 'initialValue',
        type: valueType,
        optional: true,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        toMotoko({name}) {
            return name;
        },
        inferType({initialValue}) {
            return initialValue;
        },
    }],
    controls: [{
        key: 'flexible',
        type: boolType,
    }, {
        key: 'readonly',
        type: 'Bool',
    }],
}, {
    toMotoko({visibility, flexible, name, initialValue, readonly}) {
        let modifiers = [visibility !== 'system' && visibility, !flexible && 'stable'].filter(m => m).join(' '); //TODO: combine into single control

        return `${modifiers && modifiers + ' '}${readonly ? 'let' : 'var'} ${name}${initialValue ? ' = ' + initialValue : ''};`;
    },
});
export default block;
