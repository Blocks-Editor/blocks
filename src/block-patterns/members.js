export function unaryOperator(type, symbol, evaluator) {
    return {
        title: `${symbol}${type.toLowerCase()}`,
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

export function binaryOperator(type, symbol, evaluator) {
    return {
        title: `${type.toLowerCase()} ${symbol} ${type.toLowerCase()}`,
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