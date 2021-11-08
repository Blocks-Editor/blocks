import {referenceType, textType} from '../block-types/types';
import {FaItalic} from 'react-icons/fa';
import {importRef} from '../compilers/MotokoCompiler';

const block = {
    title: 'Import Reference',
    // category: defaultCategory,
    icon: FaItalic,
    topRight: 'value',
    outputs: [{
        key: 'value',
        type: referenceType,
        toMotoko({path}) {
            return importRef(path);
        },
    }],
    controls: [{
        key: 'path',
        type: textType,
        config: {
            validation: {
                minLength: 1,
            },
        },
    }],
};
export default block;
