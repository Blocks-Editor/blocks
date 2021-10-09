exports.default = {
    title: 'Update Variable',
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        key: 'value',
        type: 'Value',
    }, {
        key: 'after',
        type: 'Effect',
        optional: true,
    }],
    outputs: [{
        key: 'before',
        type: 'Effect',
        compile({name, value, after}) {
            return `${name} := ${value};${after ? ' ' + after : ''}`;
        },
    }, {
        key: 'value',
        type: 'Value',
        compile({name, value}) {
            return `(${name} := ${value})`;
        },
    }],
};

