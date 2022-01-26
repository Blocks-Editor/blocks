import {boolType, floatType, getType} from '../block-types/types';
import {operatorCategory} from '../block-categories/categories';
import {formatParentheses} from '../editor/format/formatHelpers';

export function unaryOperatorBlock(type, symbol, evaluate) {
    type = getType(type);
    return {
        topRight: 'result',
        title: `(${symbol} a)`,
        category: operatorCategory,
        inputs: [{
            key: 'input',
            title: 'a',
            type,
        }],
        outputs: [{
            key: 'result',
            type,
            toMotoko({input}) {
                return `${symbol}(${input})`;
            },
            // inferType({input}) {
            //     return input;
            // },
        }],
    };
}

export function binaryOperatorBlock(type, symbol, evaluate) {
    let [inputType, resultType] = Array.isArray(type) ? type : [type, type];

    inputType = getType(inputType);
    resultType = getType(resultType);

    return {
        title: `(a ${symbol} b)`,
        category: operatorCategory,
        info: `Perform the '${symbol}' operation between two ${type.name} values`,
        topRight: 'result',
        inputs: [{
            key: 'left',
            title: 'a',
            type: inputType,
        }, {
            key: 'right',
            title: 'b',
            type: inputType,
        }],
        outputs: [{
            key: 'result',
            type: resultType,
            toMotoko({left, right}) {
                return formatParentheses(`${left} ${symbol} ${right}`);
            },
            // inferType({left, right}) {
            //     return left.getSharedType(right);
            // },
        }],
    };
}

export function logicalBinaryOperatorBlock(...args) {
    return binaryOperatorBlock(boolType, ...args);
}

export function arithmeticOperatorBlock(...args) {
    return binaryOperatorBlock(floatType, ...args);
}

export function numberComparisonOperatorBlock(...args) {
    return binaryOperatorBlock([floatType, boolType], ...args);
}