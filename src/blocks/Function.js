exports.default = {
    inputs: [{
        key: 'member',
        type: 'Member',
        compile,
    }, {
        key: 'returnType',
        type: 'Type',
    }],
    outputs: [{
        key: 'body',
        type: 'Effect',
    }, {
        key: 'lambda',
        type: 'Value',
        compile,
    }],
    controls: [{
        key: 'name',
        type: 'Text',
    }],
};

function compile(node, compiler) {
    let name = compiler.getControl(node, 'name');
    return `func${name ? ' ' + name : ''}() {${compiler.getOutput(node, 'body')}}`;
}
