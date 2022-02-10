import {principalType} from '../block-types/types';
import {principalImportRef} from './LiteralPrincipal';

const block = {
    title: 'Anonymous',
    info: 'The anonymous Principal address (2vxsx-fae).',
    topRight: 'value',
    width: 4,
    outputs: [{
        key: 'value',
        type: principalType,
        toMotoko() {
            return `${principalImportRef}.fromText("2vxsx-fae")`;
        },
    }],
};
export default block;
