import React, {useContext, useState} from 'react';
import classNames from 'classnames';
import styled, {css} from 'styled-components';
import {FiClipboard, FiMaximize2, FiMinimize2, FiX} from 'react-icons/fi';
import {FaPlay} from 'react-icons/fa';
import CodeEditor from '../monaco/CodeEditor';
import compileGlobalMotoko from '../../utils/compileGlobalMotoko';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../contexts/EventsContext';
import useOutputPanelVisibleState from '../../hooks/settings/useOutputPanelVisibleState';
import useFullscreenPanelState from '../../hooks/settings/useFullscreenPanelState';
import useListener from '../../hooks/utils/useListener';
import {Button} from 'react-bootstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/Component';

const OutputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 55px; // Magic temporary evil number
    bottom: 0;
    right: 0;
    width: 40%;
    transition: 0.4s;
    z-index: 100;
    //padding-top: 95px;

    ${props => props.closed && css`
        transform: translateX(100%);
    `}

    ${props => props.fullscreen && css`
        width: 100%;
    `}
`;

const ClipboardButton = styled.div`
    opacity: 0.7;

    &:hover {
        opacity: 1;
    }
`;

const outputPanelId = 'output';

export default function OutputPanel({getEditor}) {

    // Get current output source code
    const getOutput = () => {
        return compileGlobalMotoko(getEditor());
    };

    const [visible, setVisible] = useOutputPanelVisibleState();
    const [fullscreen, setFullscreen] = useFullscreenPanelState();
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => setOutput(getOutput) & setCopied(false));

    return (
        <OutputContainer
            className={classNames('output-panel px-3 pt-3')}
            closed={!visible}
            fullscreen={fullscreen === outputPanelId}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="clickable px-2 pb-2" onClick={() => setVisible(false)}>
                    <FiX size={18}/>
                </div>
                <h3 className="mx-3 mb-0 noselect">Compiled Output</h3>
                <div
                    className="clickable px-2 pb-2"
                    onClick={() => setFullscreen(fullscreen === outputPanelId ? false : outputPanelId)}>
                    {fullscreen === outputPanelId
                        ? <FiMinimize2 size={18}/> // TODO: horizontally flip icons and swap positions with close button?
                        : <FiMaximize2 size={18}/>
                    }
                </div>
            </div>
            <div className="flex-grow-1 text-muted">
                <CodeEditor value={output} readOnly={true}/>
            </div>
            <div className="bottom-bar d-flex flex-row align-items-center justify-content-end py-2">
                <CopyToClipboard text={output} onCopy={() => setCopied(true)}>
                    <ClipboardButton className="clickable d-flex flex-row align-items-center justify-content-center py-2 px-3">
                        <small>{copied ? 'Copied! ' : 'Copy to Clipboard'}</small>
                        <FiClipboard className="ms-2"/>
                    </ClipboardButton>
                </CopyToClipboard>
                <a
                    href="https://m7sm4-2iaaa-aaaab-qabra-cai.raw.ic0.app/"
                    target="_blank"
                    rel="noreferrer"
                    style={{textDecoration: 'none'}}>{/*Temporary style until Nate makes this actually look good*/}
                    <Button variant="outline-success" className="d-flex flex-grow-1">
                        <FaPlay className="mt-1 me-2"/>
                        Motoko Playground
                    </Button>
                </a>
            </div>
        </OutputContainer>
    );
}