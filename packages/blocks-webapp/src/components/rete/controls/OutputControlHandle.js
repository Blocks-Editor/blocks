import React, {useContext, useState} from 'react';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../contexts/EventsContext';
import useListener from '../../../hooks/useListener';
import Loading from '../../common/Loading';
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/Component';
import {FaCopy} from 'react-icons/fa';
import {Button} from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import useReactTooltip from '../../../hooks/useReactTooltip';


export default function OutputControlHandle({control, bindInput, query}) {

    const findValue = async () => {
        try {
            return await query(control, control.getNode(), control.editor);
        }
        catch(err) {
            console.warn(err);
            return `<${err}>`;
        }
    };

    const [valuePromise, setValuePromise] = useState(findValue);
    const [copied, setCopied] = useState(findValue);

    const events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => {
        setValuePromise(findValue());
    });

    let tooltipRef;
    const showTooltip = () => {
        setCopied(true)
        // ReactTooltip.show(tooltipRef);
        setTimeout(() => /*ReactTooltip.hide(tooltipRef)&*/setCopied(false), 500);
    };

    useReactTooltip();

    // TODO: "Copy to Clipboard" tooltip

    return (
        <Loading promise={valuePromise}>
            {value => (value ?? null) && (
                <div className="d-flex">
                    <input
                        type="text"
                        className="w-100 small"
                        readOnly
                        ref={bindInput}
                        value={value || ''}
                    />
                    <CopyToClipboard text={value} /* onCopy={() => setCopied(true)} */ >
                        <Button
                            ref={bindInput}
                            size="sm"
                            variant="outline-light"
                            data-tip=""
                            onClick={showTooltip}>
                            <span ref={ref => tooltipRef = ref} data-tip="Copied to clipboard."/>
                            <FaCopy/>
                        </Button>
                    </CopyToClipboard>
                </div>
            )}
        </Loading>
    );
}
