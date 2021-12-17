import {containerType, identifierType, memberType, objectType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';
import {formatMembers, formatStatementBlock} from '../editor/format/formatHelpers';
import {visibilityControlProp} from '../block-patterns/member-patterns';

const block = {
    info: objectType.data.info,
    category: actorCategory,
    topLeft: 'parent',
    topRight: 'members',
    // global: true,
    computeTitle(node, editor) {
        let {name} = editor.compilers.motoko.getInputArgs(node);
        return name && `object ${name}`;
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
        key: 'parent',
        type: containerType,
        toMotoko({visibility, name, members}) {
            return [
                visibility,
                'object',
                name,
                formatStatementBlock(formatMembers(members)),
            ];
        },
    }],
    controls: [
        visibilityControlProp(),
    ],
};
export default block;