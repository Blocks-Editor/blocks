import {actorType, identifierType, memberType, paramType} from '../block-types/types';
import {actorCategory} from '../block-categories/categories';

// TODO: subclasses
let thisName = 'this';

const block = {
    category: actorCategory,
    topLeft: 'actor',
    topRight: 'members',
    global: true,
    computeTitle(node, editor) {
        let {name, params} = editor.compilers.motoko.getInputArgs(node);
        if(!name) {
            return;
        }
        return `${name}(${params.join(', ')})`;
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
            return `actor class${name ? ' ' + name : ''}(${params.join(', ')}) = ${thisName} { ${members.join(' ')} };`;
        },
        // }, {
        //     key: 'this',
        //     type: valueType,
        //     toMotoko({}) {
        //         return thisName;
        //     },
    }],
};
export default block;