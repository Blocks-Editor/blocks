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
        optional: true,
    }],
    outputs: [{
        key: 'statement',
        type: 'Effect',
        compile({condition, trueCase, falseCase}) {
            let falsePart = falseCase ? ` else {${falseCase}}` : '';
            return `if(${condition}) {${trueCase}}${falsePart};`;
        },
    }],
};
