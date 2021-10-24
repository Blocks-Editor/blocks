import {actorType, identifierType, memberType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';

const block = {
    category: actorCategory,
    // showIcon: true,
    topLeft: 'actor',
    // topRight: 'members',
    computeTitle(node, editor) {
        let name = editor.compilers.motoko.getInput(node, 'name');
        return name && `${name} (Actor)`;
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
        type: actorType,
        toMotoko({name, members}) {
            return `actor${name ? ' ' + name : ''} { ${members.join(' ')} };`;
        },
    }],
};
export default block;