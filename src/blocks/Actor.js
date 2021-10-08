exports.default = {
    inputs: [{
        key: 'members',
        type: 'Member',
        multi: true,
    }],
    // outputs: [{
    //     key: 'actor',
    //     type: 'Actor',
    //     compile({members}) {
    //     },
    // }],
    controls: [{
        key: 'name',
        type: 'Identifier',
    }],
};