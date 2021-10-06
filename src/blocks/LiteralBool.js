exports.default = {
    outputs: [{
        key: 'value',
        type: 'Bool',
        control: true,
        compile(node, compiler) {
            return String(!!node.data.value);
        },
    }],
};
