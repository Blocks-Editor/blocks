exports.default = {
    inputs: [{
        key: 'value',
        type: 'Value',
    }],
    outputs: [{
        key: 'before',
        type: 'Effect',
        compile(node, compiler) {
            let value = compiler.getInput(node, 'value');
            if(value !== undefined) {
                return `return ${value};`;
            }
        },
    }],
};