import {optionalType, valueType} from '../block-types/types';

const block = {
    title: 'Optional',
    // topRight: 'result',
    inputs: [{
        key: 'input',
        type: valueType,
    }],
    outputs: [{
        key: 'result',
        type: optionalType,
        inferType({input}) {
            return input;
        },
        toMotoko({input}) {
            return `?${input}`;
        },
    }, {
        key: 'null',
        type: optionalType,
        // inferType({input}) {
        //     return input;
        // },
        toMotoko({input}) {
            return `null`;
        },
    }],
};
export default block;
