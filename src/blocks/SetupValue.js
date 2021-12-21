import {effectType, identifierType, valueType} from '../block-types/types';
import {functionCategory} from '../block-categories/categories';
import {FOR_CONFIGURATION} from '../editor/useCases';
import {formatCurlyBraces} from '../editor/format/formatHelpers';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';

const block = {
    info: 'Run a statement using the given value',
    useCases: [FOR_CONFIGURATION],
    category: functionCategory,
    topLeft: 'input',
    topRight: 'statement',
    inputs: [{
        key: 'input',
        type: valueType,
    }, {
        key: 'statement',
        type: effectType,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({input}) {
            return input;
        },
        toMotoko({name}, node) {
            return name || nodeIdentifierRef(node);
        },
    }, {
        key: 'result',
        type: valueType,
        inferType({input}) {
            return input;
        },
        toMotoko({name, input, statement}, node) {
            name = name || nodeIdentifierRef(node);
            return `do ${formatCurlyBraces(`var ${name} = ${input};${statement ? `\n${statement}` : ''}\n${name}`)}`;
        },
    }],
    controls: [{
        key: 'name',
        type: identifierType,
        optional: true,
    }],
};
export default block;
