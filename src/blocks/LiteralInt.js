exports.default = {
    outputs: [{
        key: 'value',
        type: 'Int',
        control: true,
        compile(node, compiler) {
            return String(compiler.getInput(node, 'value'));
        },
    }],
};
