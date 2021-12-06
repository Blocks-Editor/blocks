import {literalBlock} from '../block-patterns/literal-patterns';
import {natType} from '../block-types/types';

const block = literalBlock({
    title: 'Natural Number',
}, natType);
export default block;
