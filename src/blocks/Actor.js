import {containerType, identifierType, memberType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';
import {formatMembers, formatStatementBlock} from '../editor/format/formatHelpers';

const block = {
    info: 'An actor which can be deployed as a smart contract',
    category: actorCategory,
    topLeft: 'actor',
    topRight: 'members',
    // global: true,
    hidden: true,///
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
        key: 'actor',
        type: containerType,
        toMotoko({name, members}) {
            return [
                'actor',
                name,
                formatStatementBlock(formatMembers(members)),
            ];
        },
    }],
};
export default block;