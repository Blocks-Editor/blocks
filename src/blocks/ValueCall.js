import {statementBlock} from '../block-patterns/statement-patterns';
import {functionType, valueType} from '../block-types/types';
import {FaRegPlayCircle} from 'react-icons/fa';
import {functionCategory} from '../block-categories/categories';

const block = statementBlock({
    info: 'Invoke a function value',
    title: 'Call Value',
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

    return `ignore (${callable})(${args.join(', ')});`;
});
export default block;
