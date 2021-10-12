import {literalValue} from '../block-patterns/literals';
import {textType} from '../block-types/types';

const block = literalValue('Text', textType, JSON.stringify);
export default block;
