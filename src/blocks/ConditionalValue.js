import {boolType, valueType} from '../block-types/types';

const block = {
    title: 'Map Bool',
    topRight: 'result',
    inputs: [{
        key: 'condition',
        type: boolType,
    }, {
        key: 'true',
        type: valueType,
    }, {
        key: 'false',
        type: valueType,
    }],
    outputs: [{
        key: 'result',
        type: valueType,
        toMotoko({condition, trueCase, falseCase}) {
            if(condition === true) {
                return trueCase;
            }
            else if(condition === false) {
                return falseCase;
            }
            return `if (${condition}) {${trueCase}} else {${falseCase}}`;
        },
    }],
};
export default block;
