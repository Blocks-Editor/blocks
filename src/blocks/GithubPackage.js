import {FaGithub} from 'react-icons/fa';
import {referenceCategory} from '../block-categories/categories';
import RepositoryControlHandle from '../components/rete/controls/RepositoryControlHandle';
import {identifierType} from '../block-types/types';

const block = {
    title: 'Package',
    info: 'Import an external package from GitHub',
    category: referenceCategory,
    icon: FaGithub,
    global: true,
    width: 10,
    topRight: 'reference',
    inputs: [{
        key: 'name',
        type: identifierType,
    }],
    outputs: [{
        key: 'reference',
        type: identifierType,
        toMotoko({name}) {
            // import reference
            return name;
        },
    }],
    controls: [{
        key: 'repository',
        title: 'GitHub address',
        config: {
            controlType: RepositoryControlHandle,
        },
    }],
};
export default block;
