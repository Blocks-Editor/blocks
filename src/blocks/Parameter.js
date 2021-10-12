const block = {
    topLeft: 'param',
    // topRight: 'value',
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        key: 'type',
        type: 'Type',
    }],
    outputs: [{
        key: 'param',
        type: 'Param',
        compile({name, type}) {
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