import {identifierType, memberType, valueType} from '../block-types/types';

const block = {
    topLeft: 'member',
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
    }, {
        key: 'member',
        type: memberType,
        compile({name, defaultValue}) {
            return `var ${name}${defaultValue ? ' = ' + defaultValue : ''};`;
        },
    }],
};
export default block;
