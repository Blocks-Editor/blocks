import {floatType, textType} from '../block-types/types';
import {commentCategory} from '../block-categories/categories';
import CommentNodeView from '../components/rete/nodes/views/CommentNodeView';
import {FOR_DOCUMENTATION} from '../editor/useCases';

const block = {
    info: 'A text comment',
    useCases: [FOR_DOCUMENTATION],
    category: commentCategory,
    global: true,
    component: CommentNodeView,
    controls: [{
        key: 'text',
        type: textType,
    }, {
        key: 'widthPixels',
        type: floatType,
    }],
};
export default block;