const block = {
    inputs: [{
        key: 'name',
        type: 'Identifier',
        // }, {
        //     key: 'type',
        //     type: 'Type',
    }],
    outputs: [{
        key: 'param',
        type: 'Param',
        compile({name}, node, compiler) {
            let type = compiler.getType(node, 'value') || '?';
            return `${name}: ${type}`;
        },
    }, {
        key: 'value',
        type: 'Value',
        compile({name}) {
            return name;
        },
    }],
};
export default block;