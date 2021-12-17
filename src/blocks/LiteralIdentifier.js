import {identifierType} from '../block-types/types';
import {FaItalic} from 'react-icons/fa';

const block = {
    title: 'Name',
    info: identifierType.data.info,
    // category: defaultCategory,
    icon: FaItalic,
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: identifierType,
        control: true,
        toMotoko({value}) {
            return value;
        },
    }],
};
export default block;
