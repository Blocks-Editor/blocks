import {statementBlock} from '../block-patterns/statement-patterns';
import {functionType, valueType} from '../block-types/types';
import {FaRegPlayCircle} from 'react-icons/fa';
import {functionCategory} from '../block-categories/categories';
import {FOR_CUSTOM_LOGIC, FOR_REUSABLE_LOGIC} from '../editor/useCases';
import {formatOptionalParentheses} from '../editor/format/formatHelpers';

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
        title: 'Inputs',
        type: valueType,
        multi: true,
    }],
    outputs: [{
        key: 'value',
        title: 'Result',
        info: 'Call the function and output the result',
        type: valueType,
        inferType({callable}) {
            if(functionType.isSubtype(callable)) {
                return callable.generics[1];
            }
            return functionType;///
        },
        toMotoko({callable, args}, node, compiler) {
            return `${formatOptionalParentheses(callable)}(${args.join(', ')})`;
        },
    }],
}, ({callable, args}, node, compiler) => {

    return `ignore ${callable}${formatOptionalParentheses(args.join(', '))};`;
});
export default block;
