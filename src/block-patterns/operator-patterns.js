import {getType} from '../block-types/types';

export function unaryOperatorBlock(type, symbol, evaluate) {
    type = getType(type);
    return {
        topRight: 'result',
        title: `(${symbol}${type.name})`,
        inputs: [{
            key: 'input',
            type,
        }],
        outputs: [{
            key: 'result',
            type,
            compile({input}) {
                return `${symbol}(${input})`;
            },
        }],
    };
}

export function binaryOperatorBlock(type, symbol, evaluate) {
    type = getType(type);
    return {
        topRight: 'result',
        title: `(${type.name} ${symbol} ${type.name})`,
        inputs: [{
            key: 'a',
            type,
        }, {
            key: 'b',
            type,
        }],
        outputs: [{
            key: 'result',
            type,
            compile({a, b}) {
                return `(${a} ${symbol} ${b})`;
            },
        }],
    };
}