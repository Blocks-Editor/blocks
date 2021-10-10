import {statement} from '../block-patterns/statements';

const block = statement({
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
export default block;