import {floatType, textType} from '../block-types/types';
import {commentCategory} from '../block-categories/categories';
import CommentRegionNodeView from '../components/rete/nodes/views/RegionNodeView';
import {FaSquareFull} from 'react-icons/fa';
import {FOR_ORGANIZATION} from '../editor/useCases';

const block = {
    title: 'Region',
    info: 'A background region',
    useCases: [FOR_ORGANIZATION],
    category: commentCategory,
    icon: FaSquareFull,
    // global: true,
    component: CommentRegionNodeView,
    controls: [{
        key: 'text',
        type: textType,
    }, {
        key: 'widthPixels',
        type: floatType,
    }, {
        key: 'heightPixels',
        type: floatType,
    }],
};
export default block;
