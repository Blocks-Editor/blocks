import {getType} from '../block-types/types';

export function unaryOperator(type, symbol, evaluate) {
    type = getType(type);
    return {
        topRight: 'result',
        title: `${symbol}${type.name.toLowerCase()}`,
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

export function binaryOperator(type, symbol, evaluate) {
    type = getType(type);
    return {
        topRight: 'result',
        title: `${type.name.toLowerCase()} ${symbol} ${type.name.toLowerCase()}`,
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