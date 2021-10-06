exports.default = {
    inputs: [{
        key: 'condition',
        type: 'Bool',
    }, {
        key: 'true',
        type: 'Value',
    }, {
        key: 'false',
        type: 'Value',
    }],
    outputs: [{
        key: 'result',
        type: 'Value',
        compile(node, compiler) {
            let condition = compiler.getInput(node, 'condition');
            let trueCase = compiler.getInput(node, 'true');
            let falseCase = compiler.getInput(node, 'false');
            if(condition !== undefined && trueCase !== undefined && falseCase !== undefined) {
                if(condition === true) {
                    return trueCase;
                }
                else if(condition === false) {
                    return falseCase;
                }
                return `if (${condition}) {${trueCase}} else {${falseCase}}`;
            }
        },
    }],
};
