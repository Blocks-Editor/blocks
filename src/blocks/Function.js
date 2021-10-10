const block = {
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
        key: 'lambda',
        type: 'Value',
        compile,
    }, {
        key: 'member',
        type: 'Member',
        compile,
    }],
};
export default block;

function compile({name, params, returnType, body}) {
    return `func${name ? ' ' + name : ''}(${params.join(', ')})${returnType !== 'Void' ? ': ' + returnType : ''} {${body}}`;
}
