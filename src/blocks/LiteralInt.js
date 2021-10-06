exports.default = {
    title: 'Integer',
    outputs: [{
        key: 'value',
        type: 'Int',
        control: true,
        compile(node, compiler) {
            return String(compiler.getControl(node, 'value') || 0);
        },
    }],
};
