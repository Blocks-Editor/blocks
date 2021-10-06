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
            compile(node, compiler) {
                let a = compiler.getInput(node, 'value');
                if(a !== undefined) {
                    return `${symbol}(${a})`;
                }
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
            compile(node, compiler) {
                let a = compiler.getInput(node, 'a');
                let b = compiler.getInput(node, 'b');
                if(a !== undefined && b !== undefined) {
                    return `(${a} ${symbol} ${b})`;
                }
            },
        }],
    };
}