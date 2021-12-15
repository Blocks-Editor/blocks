import {containerType, identifierType, memberType, paramType, principalType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';
import nodeIdentifierRef from '../compilers/utils/nodeIdentifierRef';
import {formatMembers, formatParentheses, formatStatementBlock} from '../editor/format/formatHelpers';

// TODO: subclasses
let thisName = 'this';

const block = {
    info: 'An object-oriented class of actors',
    category: actorCategory,
    topLeft: 'actor',
    topRight: 'members',
    // global: true,
    computeTitle(node, editor) {
        let {name, params} = editor.compilers.motoko.getInputArgs(node);
        if(!name) {
            return;
        }
        return `actor class ${name}${formatParentheses(params.join(', '))}`;
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
        key: 'actor',
        type: containerType,
        toMotoko({name, params, members}, node, compiler) {
            let hasCaller = node.outputs.get('caller').connections.length;

            return `${hasCaller ? `shared (${nodeIdentifierRef(node)}) ` : ''}actor class${name ? ' ' + name : ''}${formatParentheses(params.join(', '))} = ${thisName} ${formatStatementBlock(formatMembers(members))}`;
        },
        // }, {
        //     key: 'this',
        //     type: valueType,
        //     toMotoko({}) {
        //         return thisName;
        //     },
    }, {
        key: 'caller',
        type: principalType,
        toMotoko(args, node, compiler) {
            return `${nodeIdentifierRef(node)}.caller`;
        },
    }],
};
export default block;