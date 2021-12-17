import {containerType, identifierType, memberType, paramType, principalType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {formatMembers, formatParentheses, formatStatementBlock} from '../editor/format/formatHelpers';
import {visibilityControlProp} from '../block-patterns/member-patterns';

// TODO: subclasses
let thisName = 'this';

const block = {
    info: 'An object-oriented class',
    category: actorCategory,
    topLeft: 'parent',
    topRight: 'members',
    global: true,
    hidden: true,///
    computeTitle(node, editor) {
        let {name, params} = editor.compilers.motoko.getInputArgs(node);
        if(!name) {
            return;
        }
        return `class ${name}${formatParentheses(params.join(', '))}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
        optional: true,
    }, {
        key: 'members',
        type: memberType,
        multi: true,
    }, {
        key: 'params',
        type: paramType,
        multi: true,
    }],
    outputs: [{
        key: 'parent',
        type: containerType,
        toMotoko({visibility, name, params, members}, node, compiler) {
            let hasCaller = node.outputs.get('caller').connections.length;

            return `${visibility} ${hasCaller ? `shared (${nodeIdentifierRef(node)}) ` : ''}class${name ? ' ' + name : ''}${formatParentheses(params.join(', '))} = ${thisName} ${formatStatementBlock(formatMembers(members))}`;
        },
        // }, {
        //     key: 'this',
        //     type: valueType,
        //     toMotoko({}) {
        //         return thisName;
        //     },
    }, /*{
        key: 'caller',
        type: principalType,
        advanced: true,
        toMotoko(args, node, compiler) {
            return `${nodeIdentifierRef(node)}.caller`;
        },
    }, */{
        key: 'self',
        type: principalType,
        advanced: true,
        toMotoko(args, node, compiler) {
            return thisName;
        },
    }],
    controls: [
        visibilityControlProp(),
    ],
};
export default block;