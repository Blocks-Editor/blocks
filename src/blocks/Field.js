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
        key: 'defaultValue',
        type: valueType,
        optional: true,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        compile({name}) {
            return name;
        },
        inferType({defaultValue}) {
            return defaultValue;
        },
    }],
}, {
    compile({visibility, stable, name, defaultValue}) {
        let modifiers = [visibility, stable && 'stable'].filter(m => m).join(' '); //TODO: combine into single control

        return `${modifiers && modifiers + ' '}var ${name}${defaultValue ? ' = ' + defaultValue : ''};`;
    },
});
export default block;
