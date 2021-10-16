import {actorType, identifierType, memberType} from '../block-types/types';

const block = {
    topLeft: 'actor',
    // topRight: 'members',
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
        compile({name, members}) {
            return `actor${name ? ' ' + name : ''} { ${members.join(' ')} };`;
        },
    }],
};
export default block;