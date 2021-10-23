import {statementBlock} from '../block-patterns/statement-patterns';

const block = statementBlock({
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
        toMotoko({name, value}) {
            return `(${name} := ${value})`;
        },
    }],
}, {
    toMotoko({name, value}) {
        return `${name} := ${value};`;
    },
});
export default block;
