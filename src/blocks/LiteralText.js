import {literalBlock} from '../block-patterns/literal-patterns';
import {textType} from '../block-types/types';

const block = literalBlock('Text', textType, JSON.stringify);
export default block;
