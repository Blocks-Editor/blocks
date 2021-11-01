import {useContext, useState} from 'react';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../../contexts/EventsContext';
import useListener from '../../../../hooks/useListener';
import useReactTooltip from '../../../../hooks/useReactTooltip';

export default function DynamicTitle({editor, node, block, fallback}) {

    const computeTitle = () => {
        try {
            return block.computeTitle(node, editor);
        }
        catch(err) {
            console.error(`Unable to compute title for node: ${node.name}`);
            console.error(err);
            return '<Error>';
        }
    };

    const [title, setTitle] = useState(computeTitle);

    const events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => setTitle(computeTitle()));

    const result = title || fallback || null;

    useReactTooltip();

    return (
        <span data-tip={result} data-delay-show={300}>{result}</span>
    );
}