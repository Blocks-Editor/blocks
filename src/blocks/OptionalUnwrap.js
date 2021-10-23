import {optionalType} from '../block-types/types';

const block = {
    title: 'Unwrap Optional',
    topRight: 'result',
    inputs: [{
        key: 'input',
        type: optionalType,
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
    },{
        key: 'null',
        type: optionalType,
        inferType({input}) {
            return input;
        },
        toMotoko({input}) {
            return `null`;
        },
    }],
};
export default block;
