const block = {
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        key: 'members',
        type: 'Member',
        multi: true,
    }],
    outputs: [{
        key: 'actor',
        type: 'Actor',
        compile({name, members}) {
            return `actor ${name} { ${members.join('; ')} }`;
        },
    }],
};
export default block;