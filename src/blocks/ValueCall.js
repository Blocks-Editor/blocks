import {statementBlock} from '../block-patterns/statement-patterns';
import {functionType, valueType} from '../block-types/types';
import {FaRegPlayCircle} from 'react-icons/fa';
import {functionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC, FOR_REUSABLE_LOGIC} from '../editor/useCases';
import {formatParentheses} from '../editor/format/formatHelpers';

const block = statementBlock({
    title: 'Call Value',
    info: 'Invoke a callable value',
    useCases: [FOR_REUSABLE_LOGIC, FOR_CUSTOM_LOGIC],
    category: functionCategory,
    icon: FaRegPlayCircle,
    inputs: [{
        key: 'callable',
        type: functionType,
    }, {
        key: 'args',
        type: valueType,
        multi: true,
    }],
    outputs: [{
        key: 'value',
        type: valueType,
        inferType({callable}) {
            if(functionType.isSubtype(callable)) {
                return callable;
            }
            return functionType;///
        },
        toMotoko({callable, args}, node, compiler) {
            return `(${callable})(${args.join(', ')})`;
        },
    }],
}, ({callable, args}, node, compiler) => {

    return `ignore ${callable}${formatParentheses(args.join(', '))};`;
});
export default block;
