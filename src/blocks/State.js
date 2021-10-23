import {identifierType, valueType} from '../block-types/types';
import {memberBlock} from '../block-patterns/member-patterns';

const block = memberBlock({
    // topLeft: 'member',
    topRight: 'value',
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
        key: 'readonly',
        type: 'Bool',
    }],
}, {
    toMotoko({visibility, stable, name, initialValue, readonly}) {
        let modifiers = [visibility, stable && 'stable'].filter(m => m).join(' '); //TODO: combine into single control

        return `${modifiers && modifiers + ' '}${readonly ? 'let' : 'var'} ${name}${initialValue ? ' = ' + initialValue : ''};`;
    },
});
export default block;
