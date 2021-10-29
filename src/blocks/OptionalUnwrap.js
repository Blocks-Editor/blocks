import {statementBlock} from '../block-patterns/statement-patterns';
import {effectType, optionalType, valueType} from '../block-types/types';

const block = statementBlock({
    title: 'Unwrap Optional',
    inputs: [{
        key: 'input',
        type: optionalType,
    }, {
        key: 'valueCase',
        title: 'Value',
        type: effectType,
        optional: true,
    }, {
        key: 'nullCase',
        title: 'Null',
        type: effectType,
        optional: true,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({input}) {
            return input;
        },
        toMotoko({input}, node) {
            return `value__${node.id}`;
        },
    }],
}, ({input, valueCase, nullCase}, node) => {
    if(String(input) === 'null') {
        return nullCase;
    }

    let valuePart = valueCase ? `case (?value__${node.id}) {${valueCase}};` : '';
    let nullPart = nullCase ? `case null {${nullCase}};` : '';

    return `switch(${input}) {${valuePart}${nullPart && ' ' + nullPart}};`;
});
export default block;