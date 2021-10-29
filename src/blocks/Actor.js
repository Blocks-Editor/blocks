import {actorType, identifierType, memberType, paramType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';

const block = {
    category: actorCategory,
    topLeft: 'actor',
    topRight: 'members',
    computeTitle(node, editor) {
        let {name, params} = editor.compilers.motoko.getInputArgs(node);
        return name && (params.length ? `${name}(${params.join(', ')})` : name);
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
        type: actorType,
        toMotoko({name, params, members}) {
            return `actor${params.length ? ' class' : ''}${name ? ' ' + name : ''}${params.length ? `(${params.join(', ')})` : ''} { ${members.join(' ')} };`;
        },
    }],
};
export default block;