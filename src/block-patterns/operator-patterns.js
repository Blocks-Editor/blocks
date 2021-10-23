import {getType} from '../block-types/types';

export function unaryOperatorBlock(type, symbol, evaluate) {
    type = getType(type);
    return {
        topRight: 'result',
        title: `(${symbol}a)`,
        inputs: [{
            key: 'input',
            title: 'a',
            type,
        }],
        outputs: [{
            key: 'result',
            type,
            toMotoko({input}) {
                return `${symbol}(${input})`;
            },
            // inferType({input}) {
            //     return input;
            // },
        }],
    };
}

export function binaryOperatorBlock(type, symbol, evaluate) {
    type = getType(type);
    return {
        topRight: 'result',
        title: `(a ${symbol} b)`,
        inputs: [{
            key: 'left',
            title: 'a',
            type,
        }, {
            key: 'right',
            title: 'b',
            type,
        }],
        outputs: [{
            key: 'result',
            type,
            toMotoko({left, right}) {
                return `(${left} ${symbol} ${right})`;
            },
            // inferType({left, right}) {
            //     return left.getSharedType(right);
            // },
        }],
    };
}