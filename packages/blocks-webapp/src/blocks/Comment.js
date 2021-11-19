import {floatType, textType} from '../block-types/types';
import {commentCategory} from '../block-categories/categories';

const block = {
    info: 'A text comment',
    category: commentCategory,
    global: true,
    controls: [{
        key: 'text',
        type: textType,
    }, {
        key: 'widthPixels',
        type: floatType,
    }],
};
export default block;