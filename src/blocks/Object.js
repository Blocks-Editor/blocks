import {containerType, identifierType, memberType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';
import {formatMembers, formatStatementBlock} from '../editor/format/formatHelpers';

const block = {
    info: 'An object which can be deployed as a smart contract',
    category: actorCategory,
    topLeft: 'actor',
    topRight: 'members',
    // global: true,
    computeTitle(node, editor) {
        let {name} = editor.compilers.motoko.getInputArgs(node);
        return name && `actor ${name}`;
    },
    inputs: [{
        key: 'name',
        type: identifierType,
        optional: true,
    }, {
        key: 'members',
        type: memberType,
        multi: true,
    }],
    outputs: [{
        key: 'object',
        type: containerType,
        toMotoko({name, members}) {
            return [
                'object',
                name,
                formatStatementBlock(formatMembers(members)),
            ];
        },
    }],
};
export default block;