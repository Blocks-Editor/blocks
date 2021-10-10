const {statement} = require('../block-patterns/statements');

exports.default = statement({
    title: 'Update Variable',
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        key: 'value',
        type: 'Value',
    }],
    outputs: [{
        key: 'value',
        type: 'Value',
        compile({name, value}) {
            return `(${name} := ${value})`;
        },
    }],
}, ({name, value, after}) => {
    return `${name} := ${value};`;
});

