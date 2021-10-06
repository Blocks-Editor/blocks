exports.default = {
    title: 'Text',
    outputs: [{
        key: 'value',
        type: 'Text',
        control: true,
        compile(node, compiler) {
            return JSON.stringify(compiler.getControl(node, 'value'));
        },
    }],
};
