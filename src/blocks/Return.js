const block = {
    inputs: [{
        key: 'value',
        type: 'Value',
    }],
    outputs: [{
        key: 'statement',
        type: 'Effect',
        compile({value}) {
            return `return ${value};`;
        },
    }],
};
export default block;