import {natType, textType} from '../block-types/types';
import {FaSitemap} from 'react-icons/fa';

const block = {
    title: 'Length (Text)',
    info: 'Find the number of characters in a Text value',
    // category: textCategory,
    icon: FaSitemap,
    inputs: [{
        key: 'text',
        type: textType,
    }],
    outputs: [{
        key: 'value',
        type: natType,
        toMotoko({text}) {
            return `${text}.size()`;
        },
    }],
};
export default block;
