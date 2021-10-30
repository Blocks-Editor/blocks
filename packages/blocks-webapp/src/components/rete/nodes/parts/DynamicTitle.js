import {useContext, useState} from 'react';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../../contexts/EventsContext';
import useListener from '../../../../hooks/useListener';

export default function DynamicTitle({editor, node, block, fallback}) {

    let computeTitle = () => {
        try {
            return block.computeTitle(node, editor);
        }
        catch(err) {
            console.error(`Unable to compute title for node: ${node.name}`);
            console.error(err);
            return '<Error>';
        }
    };

    let [title, setTitle] = useState(computeTitle);

    let events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => setTitle(computeTitle()));

    return title || fallback || null;
}