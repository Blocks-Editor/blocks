import {useContext, useState} from 'react';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../../contexts/EventsContext';
import useListener from '../../../../hooks/utils/useListener';
import useReactTooltip from '../../../../hooks/useReactTooltip';
import getInfoText from '../../../../utils/getInfoText';

export default function DynamicTitle({editor, node, block, fallback, showInfo}) {

    const computeTitle = () => {
        /// untested
        if(editor.silent) {
            return;
        }

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

    let tooltip = result;
    if(showInfo && block.info) {
        // Add block info on new line
        const info = getInfoText(block.info);
        tooltip = result ? `${result}<br>${info}` : info;
    }

    useReactTooltip();

    return (
        <div data-tip={tooltip}>{result}</div>
    );
}