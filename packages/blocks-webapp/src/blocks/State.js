import {boolType, unitType, valueType} from '../block-types/types';
import {computeMemberName, memberBlock} from '../block-patterns/member-patterns';
import {stateCategory} from '../block-categories/categories';

const block = memberBlock({
    info: 'A persistent smart contract variable',
    topRight: 'value',
    category: stateCategory,
    computeTitle(node, editor) {
        let name = computeMemberName(node, editor);
        // let name = editor.compilers.motoko.getInput(node, 'name');
        let type = editor.compilers.type.getInput(node, 'initialValue') || unitType;
        return name && `${name}: ${editor.compilers.motoko.getTypeString(type)}`;
    },
    shortcuts: [{
        block: 'StateRead',
        nodeKey: 'stateNode',
    }, {
        block: 'StateUpdate',
        nodeKey: 'stateNode',
    }],
    inputs: [{
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
        // }, {
        //     key: 'readonly',
        //     type: 'Bool',
    }],
}, {
    toMotoko({visibility, flexible, name, initialValue}) {
        let readonly = false;/// TODO: infer and/or adjust shortcuts
        let modifiers = [visibility !== 'system' && visibility, !flexible && 'stable'].filter(m => m).join(' '); //TODO: combine into single control

        return `${modifiers && modifiers + ' '}${readonly ? 'let' : 'var'} ${name}${initialValue ? ' = ' + initialValue : ''};`;
    },
});
export default block;
