import {codeBlock} from '../block-patterns/code-patterns';
import {valueType} from '../block-types/types';

const block = codeBlock(valueType, {
    title: '{value}',
});
export default block;