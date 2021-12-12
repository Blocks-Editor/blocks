import {useMemo} from 'react';
import useObjectObservable from './utils/useObjectObservable';

export default function useTutorialVariables(progress) {

    const variables = useMemo(() => progress.tutorial.setupVariables(progress), [progress]);

    return useObjectObservable(variables);
}
