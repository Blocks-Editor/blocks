import {mapType, natType} from '../block-types/types';
import {collectionCategory} from '../block-categories/categories';
import {FaSitemap} from 'react-icons/fa';

const block = {
    title: 'Size (Collection)',
    info: 'Determine the size (or length) of a collection',
    category: collectionCategory,
    icon: FaSitemap,
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
