exports.default = {
    inputs: [{
        key: 'before',
        type: 'Effect',
        compile(node, compiler) {
            return `return ${compiler.getInput(node, 'value')};`;
        },
    }, {
        key: 'value',
        type: 'Value',
    }],
};