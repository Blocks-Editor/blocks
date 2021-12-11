import React, {useContext, useState} from 'react';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../../contexts/EventsContext';
import useListener from '../../../hooks/utils/useListener';
import Loading from '../../common/Loading';
import CopyToClipboardButton from '../../common/CopyToClipboardButton';

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
    // const [copied, setCopied] = useState();

    const events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => {
        setValuePromise(findValue());
    });

    // let tooltipRef;
    // const showTooltip = () => {
    //     setCopied(true);
    //     ReactTooltip.show(tooltipRef);
    //     setTimeout(() => /*ReactTooltip.hide(tooltipRef)&*/setCopied(false), 1000);
    // };

    // useReactTooltip();

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
                    <CopyToClipboardButton text={value} /* onCopy={() => setCopied(true)} */ >
                        {/*<Button*/}
                        {/*    ref={bindInput}*/}
                        {/*    size="sm"*/}
                        {/*    variant="outline-light"*/}
                        {/*    data-tip={copied ? undefined : 'Copy to Clipboard'}*/}
                        {/*    onClick={showTooltip}>*/}
                        {/*    <span ref={ref => tooltipRef = ref} data-tip="Copied!"/>*/}
                        {/*    <FaCopy/>*/}
                        {/*</Button>*/}
                    </CopyToClipboardButton>
                </div>
            )}
        </Loading>
    );
}
