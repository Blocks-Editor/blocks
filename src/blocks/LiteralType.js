import {literalBlock} from '../block-patterns/literal-patterns';
import {typeType, valueType} from '../block-types/types';

const block = literalBlock('Type', typeType.of(valueType));
export default block;
