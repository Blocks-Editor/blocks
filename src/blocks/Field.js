const block = {
    topLeft: 'member',
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        //     key: 'type',
        //     type: 'Type',
        // }, {
        key: 'defaultValue',
        type: 'Value',
        optional: true,
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
            return `var ${name}${defaultValue ? ' = ' + defaultValue : ''};`;
        },
    }],
};
export default block;
