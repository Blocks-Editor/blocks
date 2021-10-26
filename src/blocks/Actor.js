import {actorType, identifierType, memberType, paramType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';

const block = {
    category: actorCategory,
    // showIcon: true,
    topLeft: 'actor',
    computeTitle(node, editor) {
        let {name, params} = editor.compilers.motoko.getInputArgs(node);
        return name && (params.length ? `${name}(${params.join(', ')})` : name);
    },
    inputs: [{
        key: 'name',
        type: identifierType,
        optional: true,
    }, {
        key: 'params',
        type: paramType,
        multi: true,
    }, {
        key: 'members',
        type: memberType,
        multi: true,
    }],
    outputs: [{
        key: 'actor',
        type: actorType,
        toMotoko({name, params, members}) {
            return `actor${params.length ? ' class' : ''}${name ? ' ' + name : ''}(${params.join(', ')}) { ${members.join(' ')} };`;
        },
    }],
};
export default block;