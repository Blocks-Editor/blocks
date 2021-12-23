import {Button} from 'react-bootstrap';
import {FaCopy} from 'react-icons/fa';
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/Component';
import React, {useState} from 'react';
import ReactTooltip from 'react-tooltip';
import useReactTooltip from '../../hooks/useReactTooltip';

export default function CopyToClipboardButton({text, size, variant, buttonRef, ...others}) {

    const [copied, setCopied] = useState();

    let tooltipRef;
    const showTooltip = () => {
        setCopied(true);
        ReactTooltip.show(tooltipRef);
        setTimeout(() => /*ReactTooltip.hide(tooltipRef)&*/setCopied(false), 1000);
    };

    useReactTooltip();

    return (
        <CopyToClipboard text={text} /* onCopy={() => setCopied(true)} */ >
            <Button
                ref={buttonRef}
                size={size || 'sm'}
                variant={variant || 'outline-light'}
                className="d-flex py-2"
                data-tip={copied ? undefined : 'Copy to Clipboard'}
                onClick={showTooltip}>
                <span ref={ref => tooltipRef = ref} data-tip="Copied!"/>
                <FaCopy/>
            </Button>
        </CopyToClipboard>
    );
}