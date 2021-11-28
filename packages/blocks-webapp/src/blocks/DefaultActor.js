import {containerType, identifierType, memberType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';

const block = {
    info: 'The top-level actor for the application. All ',
    category: actorCategory,
    topLeft: 'actor',
    // topRight: 'members',
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
        key: 'actor',
        type: containerType,
        toMotoko({name, members}) {
            return `actor${name ? ' ' + name : ''} { ${members.join(' ')} };`;
        },
    }],
};
export default block;