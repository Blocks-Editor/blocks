import {containerType, identifierType, memberType, paramType, principalType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';
import {formatParentheses} from '../editor/format/formatHelpers';
import {getUserDefinedName, visibilityControlProp} from '../block-patterns/member-patterns';
import {FaBox} from 'react-icons/fa';

// TODO: subclasses
let thisName = 'this';

const block = {
    info: 'An object-oriented class',
    category: actorCategory,
    icon: FaBox,
    topLeft: 'member',
    topRight: 'members',
    global: true,
    hidden: true,///
    computeTitle(node, editor) {
        let name = getUserDefinedName(node, editor);
        let {params} = editor.compilers.motoko.getInputArgs(node);
        if(!name && !params.length) {
            return;
        }
        return `class ${name || ''}${formatParentheses(params.join(', '))}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
    }, {
        key: 'members',
        type: memberType,
        multi: true,
    }, {
        key: 'params',
        title: 'Parameters',
        type: paramType,
        multi: true,
    }],
    outputs: [{
        key: 'member',
        type: containerType,
        toMotoko({visibility, name, params, members}, node, compiler) {
            // let hasCaller = node.outputs.get('caller').connections.length;
            // return `${visibility} ${hasCaller ? `shared (${nodeIdentifierRef(node)}) ` : ''}class${name ? ' ' + name : ''}${formatParentheses(params.join(', '))} = ${thisName} ${formatStatementBlock(formatMembers(members))}`;
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