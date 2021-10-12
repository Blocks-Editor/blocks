import {useMemo} from 'react';

import useEditorComponents from '../hooks/useEditorComponents';

export default function useGroupedComponents(editor, context) {
    const components = useEditorComponents(editor, context);

    return useMemo(() => {
        let retVal = {};

        components.forEach((component) => {
            if(!component.componentDefinition?.groups?.length) {
                retVal[''] = retVal[''] || [];
                retVal[''].push(component);
                return;
            }

            component.componentDefinition.groups.forEach((group) => {
                retVal[group] = retVal[group] || [];
                retVal[group].push(component);
            });
        });

        return Object.entries(retVal).map(([group, entries]) => ({
            name: group || null,
            entries,
        }));
    }, [components]);
}
