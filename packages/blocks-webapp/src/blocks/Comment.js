import {textType} from '../block-types/types';
import {commentCategory} from '../block-categories/categories';

const block = {
    info: 'A text comment',
    category: commentCategory,
    global: true,
    shortcutKey: 'c',
    // computeTitle(node, editor) {
    //     let {name} = editor.compilers.motoko.getInputArgs(node);
    //     return name && `actor ${name}`;
    // },
    controls: [{
        key: 'text',
        type: textType,
    }],
};
export default block;