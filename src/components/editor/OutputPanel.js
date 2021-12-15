import React, {useContext, useState} from 'react';
import classNames from 'classnames';
import styled, {css} from 'styled-components';
import {FiClipboard, FiMaximize2, FiMinimize2, FiX} from 'react-icons/fi';
import {FaLink, FaPlay} from 'react-icons/fa';
import CodeEditor from '../monaco/CodeEditor';
import compileGlobalMotoko from '../../compilers/utils/compileGlobalMotoko';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../contexts/EventsContext';
import useOutputPanelState from '../../hooks/persistent/useOutputPanelState';
import useFullscreenPanelState from '../../hooks/persistent/useFullscreenPanelState';
import useListener from '../../hooks/utils/useListener';
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/Component';
import ExternalLink from '../common/ExternalLink';
import useReactTooltip from '../../hooks/useReactTooltip';

const OutputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 54px; // Magic temporary evil number
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

export default function OutputPanel({editor}) {

    // Generate output source code
    const getOutput = () => {
        return compileGlobalMotoko(editor);
    };

    const [panel, setPanel] = useOutputPanelState();
    const [fullscreen, setFullscreen] = useFullscreenPanelState();
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => setOutput(getOutput) & setCopied(false));

    useReactTooltip();

    return (
        <OutputContainer
            className={classNames('output-panel px-3 pt-3')}
            closed={!panel}
            fullscreen={fullscreen === outputPanelId}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="clickable px-2 pb-2" onClick={() => setPanel(null)}>
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
            <div className="flex-grow-1">
                <CodeEditor value={output} readOnly={true}/>
            </div>
            <div className="bottom-bar d-flex flex-row align-items-center justify-content-between py-2">
                {/*<CopyToClipboard text={output} onCopy={() => setCopied(true)}>*/}
                {/*    <ClipboardButton className="clickable d-flex flex-row align-items-center justify-content-center py-2 px-3">*/}
                {/*        <small>{copied ? 'Copied!' : 'Copy to Clipboard'}</small>*/}
                {/*        <FiClipboard className="ms-2"/>*/}
                {/*    </ClipboardButton>*/}
                {/*</CopyToClipboard>*/}
                <ExternalLink className="flex-grow-1" href="https://smartcontracts.org/docs/language-guide/basic-concepts.html">
                    <div
                        className="btn btn-outline-secondary d-flex justify-content-center"
                        data-tip="Learn more about the Motoko programming language.">
                        <FaLink className="mt-1 me-2"/>
                        Documentation
                    </div>
                </ExternalLink>
                <CopyToClipboard text={output} onCopy={() => setCopied(true)}>
                    <ClipboardButton
                        className="clickable d-flex justify-content-center py-2 px-4"
                        data-tip="Copy to Clipboard"
                        data-delay-show={100}>
                        <FiClipboard className="h5 mb-0"/>
                        {copied && <small className="ms-2">Copied!</small>}
                    </ClipboardButton>
                </CopyToClipboard>
                <ExternalLink className="flex-grow-1" href="https://m7sm4-2iaaa-aaaab-qabra-cai.raw.ic0.app/">
                    <div
                        className="btn btn-outline-success d-flex justify-content-center"
                        data-tip="Run and deploy your smart contract on Motoko Playground.">
                        <FaPlay className="mt-1 me-2"/>
                        Playground
                    </div>
                </ExternalLink>
            </div>
        </OutputContainer>
    );
}