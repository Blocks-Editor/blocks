const {statement} = require('../block-patterns/statements');

exports.default = statement({
    inputs: [{
        key: 'condition',
        type: 'Bool',
    }, {
        key: 'trueCase',
        title: 'True',
        type: 'Effect',
    }, {
        key: 'falseCase',
        title: 'False',
        type: 'Effect',
        optional: true,
    }],
}, ({condition, trueCase, falseCase}) => {
    let falsePart = falseCase ? ` else {${falseCase}}` : '';
    return `if(${condition}) {${trueCase}}${falsePart};`;
});
