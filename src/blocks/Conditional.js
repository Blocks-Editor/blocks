exports.default = {
    inputs: [{
        key: 'before',
        type: 'Effect',
        compile(node, compiler) {
            let condition = compiler.getInput(node, 'condition');
            let trueCase = compiler.getOutput(node, 'true');
            let falseCase = compiler.getOutput(node, 'false');
            if(condition !== undefined && trueCase !== undefined && falseCase !== undefined) {
                return `if (${condition}) {${trueCase}} else {${falseCase}}`;
            }
        },
    }, {
        key: 'condition',
        type: 'Bool',
    }],
    outputs: [{
        key: 'true',
        type: 'Effect',
    }, {
        key: 'false',
        type: 'Effect',
    }],
};
