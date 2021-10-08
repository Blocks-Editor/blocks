exports.default = {
    inputs: [{
        key: 'condition',
        type: 'Bool',
    }, {
        key: 'true',
        type: 'Effect',
    }, {
        key: 'false',
        type: 'Effect',
    }],
    outputs: [{
        key: 'before',
        type: 'Effect',
        compile(node, compiler) {
            let condition = compiler.getInput(node, 'condition');
            let trueCase = compiler.getInput(node, 'true');
            let falseCase = compiler.getInput(node, 'false');
            if(condition !== undefined && trueCase !== undefined && falseCase !== undefined) {
                return `if (${condition}) {${trueCase}} else {${falseCase}}`;
            }
        },
    }],
};
