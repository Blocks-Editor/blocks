import {mapType, natType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';

const block = {
    title: 'Size',
    category: collectionCategory,
    inputs: [{
        key: 'collection',
        type: mapType,
    }],
    outputs: [{
        key: 'value',
        type: natType,
        toMotoko({map}) {
            return `${map}.size()`;
        },
    }],
};
export default block;
