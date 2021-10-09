exports.default = {
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        //     key: 'type',
        //     type: 'Type',
        // }, {
        key: 'defaultValue',
        type: 'Value',
    }],
    outputs: [{
        key: 'value',
        type: 'Value',
        compile({name}) {
            return name;
        },
    }, {
        key: 'member',
        type: 'Member',
        compile({name, defaultValue}) {
            return `var ${name} = ${defaultValue};`;
        },
    }],
};

function compile({name, params, returnType, body}) {
    return `func${name ? ' ' + name : ''}(${params.join(', ')})${returnType !== 'Void' ? ' ' + returnType : ''} {${body}}`;
}
