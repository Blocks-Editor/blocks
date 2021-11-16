import {floatType, textType} from '../block-types/types';
import {commentCategory} from '../block-categories/categories';

const block = {
    info: 'A text comment',
    category: commentCategory,
    global: true,
    // computeTitle(node, editor) {
    //     let {name} = editor.compilers.motoko.getInputArgs(node);
    //     return name && `actor ${name}`;
    // },
    controls: [{
        key: 'text',
        type: textType,
    }, {
        key: 'width',
        type: floatType,
    }],
};
export default block;