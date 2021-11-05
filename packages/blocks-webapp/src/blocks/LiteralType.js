import {typeCategory} from '../block-categories/categories';
import {typeType, valueType} from '../block-types/types';

const block = {
    title: 'Type',
    category: typeCategory,
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: typeType.of(valueType),
        control: true,
        inferType({value}) {
            // return typeType.of(value);
            return value;
        },
    }],
};
export default block;
