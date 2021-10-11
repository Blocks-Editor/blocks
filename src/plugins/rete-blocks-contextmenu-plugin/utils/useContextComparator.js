import {useContext} from 'react';
import {OptionsContext} from '../contexts/OptionsContext';

export default function useContextComparator() {
    const options = useContext(OptionsContext);

    return options.contextComparator;
}
