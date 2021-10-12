const block = {
    topLeft: 'member',
    topRight: 'body',
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        key: 'params',
        type: 'Param',
        multi: true,
    }, {
        key: 'body',
        type: 'Effect',
    }/*, {
        key: 'returnType',
        type: 'Type',
    }*/],
    outputs: [{
        key: 'reference',
        type: 'Value',
        compile({name}) {
            return name;
        },
    }, {
        key: 'member',
        type: 'Member',
        compile({name, params, body}, node, compiler) {
            let returnType = compiler.inferType(node, 'body') || '?';
            return `func${name ? ' ' + name : ''}(${params.join(', ')})${returnType !== 'Void' ? ': ' + returnType : ''} {${body}}`;
        },
    }],
};
export default block;

