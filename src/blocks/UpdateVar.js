import {statement} from '../block-patterns/statements';

const block = statement({
    title: 'Update Variable',
    inputs: [{
        key: 'name',
        type: 'Identifier',
    }, {
        key: 'value',
        type: 'Value',
    }],
    outputs: [{
        key: 'newValue',
        type: 'Value',
        compile({name, value}) {
            return `(${name} := ${value})`;
        },
    }],
}, ({name, value}) => {
    return `${name} := ${value};`;
});
export default block;
