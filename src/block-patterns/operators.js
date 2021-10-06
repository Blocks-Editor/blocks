export function unaryOperator(type, symbol, evaluator) {
    return {
        title: `${symbol}${type}`,
        inputs: [{
            key: 'input',
            type,
        }],
        outputs: [{
            key: 'result',
            type,
            compile(node, compiler) {
                return `${symbol}${compiler.getInput(node, 'a')}`;
            },
        }],
    };
}

export function binaryOperator(type, symbol, evaluator) {
    return {
        title: `${type} ${symbol} ${type}`,
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
            compile(node, compiler) {
                return `${compiler.getInput(node, 'a')} ${symbol} ${compiler.getInput(node, 'b')}`;
            },
        }],
    };
}