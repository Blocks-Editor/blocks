import {boolType, mapType, natType, valueType} from '../block-types/types';
import {statementBlock} from '../block-patterns/statement-patterns';
import {collectionCategory} from '../block-categories/categories';
import {stateWriteIcon} from './State';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {formatCurlyBraces, formatParentheses, formatStatementBlock} from '../editor/format/formatHelpers';
import {optionImportRef} from './OptionalOrDefault';

const block = statementBlock({
    title: 'Transfer (Map)',
    category: collectionCategory,
    icon: stateWriteIcon,
    // deprecated: true,
    inputs: [{
        key: 'map',
        type: mapType,
    }, {
        key: 'from',
        type: valueType,
    }, {
        key: 'to',
        type: valueType,
    }, {
        key: 'amount',
        type: natType,
    }],
    outputs: [{
        key: 'success',
        type: boolType,
        toMotoko(args, node) {
            return nodeIdentifierRef(node, 'success');
        },
    }],
}, ({map, from, to, amount}, node) => {
    const successRef = nodeIdentifierRef(node, 'success');
    const amountRef = nodeIdentifierRef(node, 'amount');
    const fromBalanceRef = nodeIdentifierRef(node, 'balance');
    return `let ${successRef} = do ${formatStatementBlock([
        `let ${fromBalanceRef} = ${optionImportRef}.get(${map}.get(${from}), 0);\n`,
        `let ${amountRef} = ${amount};\n`,
        `if ${formatParentheses(`${fromBalanceRef} >= ${amountRef}`)} ${formatCurlyBraces([
            `${map}.put(${from}, ${fromBalanceRef} - ${amountRef});\n`,
            `${map}.put(${to}, ${optionImportRef}.get(${map}.get(${to}), 0) + ${amountRef});\n`,
            true,
        ])}`,
        `else ${formatCurlyBraces(false)}`,
    ])}`;
});
export default block;
