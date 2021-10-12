const block = {
    topLeft: 'actor',
    // topRight: 'members',
    inputs: [{
        key: 'name',
        type: 'Identifier',
        optional: true,
    }, {
        key: 'members',
        type: 'Member',
        multi: true,
    }],
    outputs: [{
        key: 'actor',
        type: 'Actor',
        compile({name, members}) {
            return `actor${name ? ' ' + name : ''} { ${members.join(' ')} }`;
        },
    }],
};
export default block;