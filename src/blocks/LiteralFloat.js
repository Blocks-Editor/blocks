exports.default = {
    title: 'Float',
    outputs: [{
        key: 'value',
        type: 'Float',
        control: true,
        compile(node, compiler) {
            return String(node.data.value) + 'f';
        },
    }],
};
