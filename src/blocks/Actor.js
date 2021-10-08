const Compiler = require('../editor/utils/Compiler').default;

exports.default = {
    inputs: [{
        key: 'members',
        type: 'Member',
        multi: true,
    }],
    // outputs: [{
    //     key: 'actor',
    //     type: 'Actor',
    //     compile(node, compiler) {
    //         // TODO
    //     },
    // }],
    controls: [{
        key: 'name',
        type: 'Identifier',
    }],
};