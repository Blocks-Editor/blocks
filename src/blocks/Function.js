exports.default = {
    inputs: [{
        key: 'body',
        type: 'Effect',
    }, {
        key: 'returnType',
        type: 'Type',
    }],
    outputs: [{
        key: 'lambda',
        type: 'Value',
        compile,
    }, {
        key: 'member',
        type: 'Member',
        compile,
    }],
    controls: [{
        key: 'name',
        type: 'Identifier',
    }],
};

function compile(node, compiler) {
    let name = compiler.getControl(node, 'name');
    return `func${name ? ' ' + name : ''}() {${compiler.getInput(node, 'body')}}`;
}
