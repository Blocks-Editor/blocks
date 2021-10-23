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
}, {
    toMotoko({visibility, stable, name, initialValue}) {
        let modifiers = [visibility, stable && 'stable'].filter(m => m).join(' '); //TODO: combine into single control

        return `${modifiers && modifiers + ' '}var ${name}${initialValue ? ' = ' + initialValue : ''};`;
    },
});
export default block;
