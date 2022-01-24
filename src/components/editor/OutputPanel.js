import React, {useContext, useState} from 'react';
import classNames from 'classnames';
import styled, {css} from 'styled-components';
import {FiClipboard, FiMaximize2, FiMinimize2, FiX} from 'react-icons/fi';
import {FaLink, FaPlay} from 'react-icons/fa';
import CodeEditor from '../monaco/CodeEditor';
import compileGlobalMotoko from '../../compilers/utils/compileGlobalMotoko';
import EventsContext, {EDITOR_CHANGE_EVENT, ERROR_EVENT} from '../../contexts/EventsContext';
import useOutputPanelState from '../../hooks/persistent/useOutputPanelState';
import useFullscreenPanelState from '../../hooks/persistent/useFullscreenPanelState';
import useListener from '../../hooks/utils/useListener';
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/Component';
import ExternalLink from '../common/ExternalLink';
import useReactTooltip from '../../hooks/useReactTooltip';
import {isMobile} from 'react-device-detect';
import {onLeftClick} from '../../utils/eventHelpers';

const OutputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: ${isMobile ? 0 : 66}px; // Magic temporary evil number
    height: calc(100% - ${isMobile ? 0 : 66}px); // Magic temporary evil number; prevents scrollbar
    bottom: 0;
    right: 0;
    width: 40%;
    transition: 0.4s;
    z-index: 100;
    //padding-top: 95px;
    opacity: .98;

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

const playgroundOrigin = process.env.REACT_APP_MOTOKO_PLAYGROUND_ORIGIN;

const outputPanelId = 'output';

export default function OutputPanel({editor}) {

    const [panel, setPanel] = useOutputPanelState();
    const [fullscreen, setFullscreen] = useFullscreenPanelState();
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    // const [playgroundPromise, setPlaygroundPromise] = useState(null);

    const events = useContext(EventsContext);

    const closed = !panel;

    // Generate output source code
    const getOutput = () => compileGlobalMotoko(editor);

    // Show an error message
    // const handleError = err => events.emit(ERROR_EVENT, err);

    const handleOpenPlayground = () => {
        // let promise = playgroundPromise;
        // if(!promise) {
        //     promise = createMotokoPlaygroundShareLink(output, handleError)
        //         .then(url => {
        //             window.open(url, '_blank');
        //         })
        //         .catch(handleError)
        //         .then(() => setPlaygroundPromise(null));
        //     setPlaygroundPromise(promise);
        // }

        try {
            const playgroundWindow = window.open(`${playgroundOrigin}?integration=blocks&tag=_`, 'motokoPlayground');

            // Interval index used as acknowledge key
            const ack = setInterval(() => {
                playgroundWindow.postMessage(`blocks:${JSON.stringify({
                    type: 'workplace',
                    acknowledge: ack,
                    deploy: true,
                    actions: [{
                        type: 'loadProject',
                        payload: {
                            files: {
                                'Main.mo': compileGlobalMotoko(editor),
                            },
                        },
                    }],
                })}`, playgroundOrigin);
            }, 500);

            const acknowledgeListener = ({source, origin, data}) => {
                if(source === playgroundWindow && origin === playgroundOrigin && typeof data === 'string' && data === `blocks:acknowledge:${ack}`) {
                    clearInterval(ack);
                    window.removeEventListener('message', acknowledgeListener);
                }
            };
            window.addEventListener('message', acknowledgeListener, false);
        }
        catch(err) {
            events.emit(ERROR_EVENT, err);
        }
    };

    useListener(events, EDITOR_CHANGE_EVENT, () => {
        setOutput(closed ? '' : getOutput());
        setCopied(false);
    });

    useReactTooltip();

    // Regenerate output after opening panel
    if(!closed && !output) {
        setOutput(getOutput());
    }

    return (
        <OutputContainer
            className={classNames('output-panel px-3 pt-3', closed && 'd-none d-sm-block')}
            closed={closed}
            fullscreen={isMobile || fullscreen === outputPanelId}>
            <div className={classNames('d-flex align-items-center mb-2', !isMobile && 'justify-content-between')}>
                <div className="clickable px-2 pb-2" {...onLeftClick(() => setPanel(null))}>
                    <FiX size={18}/>
                </div>
                <h3 className="mx-3 mb-0 noselect">Compiled Output</h3>
                {!isMobile && (
                    <div
                        className="clickable px-2 pb-2"
                        {...onLeftClick(() => setFullscreen(fullscreen === outputPanelId ? false : outputPanelId))}>
                        {fullscreen === outputPanelId
                            ? <FiMinimize2 size={18}/> // TODO: horizontally flip icons and swap positions with close button?
                            : <FiMaximize2 size={18}/>
                        }
                    </div>
                )}
            </div>
            <div className="flex-grow-1">
                <CodeEditor value={output} readOnly/>
            </div>
            <div className="bottom-bar d-flex flex-row align-items-center justify-content-around py-2">
                {/*<CopyToClipboard text={output} onCopy={() => setCopied(true)}>*/}
                {/*    <ClipboardButton className="clickable d-flex flex-row align-items-center justify-content-center py-2 px-3">*/}
                {/*        <small>{copied ? 'Copied!' : 'Copy to Clipboard'}</small>*/}
                {/*        <FiClipboard className="ms-2"/>*/}
                {/*    </ClipboardButton>*/}
                {/*</CopyToClipboard>*/}
                <ExternalLink
                    // className="flex-grow-1"
                    href="https://smartcontracts.org/docs/language-guide/basic-concepts.html">
                    <div
                        className="btn btn-outline-secondary d-flex justify-content-center"
                        data-tip="Learn more about the Motoko programming language.">
                        <FaLink className="mt-1 me-2"/>
                        {isMobile ? 'Docs' : 'Documentation'}
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
                {/*<ExternalLink className="flex-grow-1" href="https://m7sm4-2iaaa-aaaab-qabra-cai.raw.ic0.app/?tag=_">*/}
                <div
                    className="btn btn-outline-success d-flex justify-content-center"
                    data-tip="Run and deploy your smart contract on Motoko Playground."
                    {...onLeftClick(handleOpenPlayground)}>
                    {/*{playgroundPromise ? (*/}
                    {/*    <FaSpinner className="mt-1 me-2"/>*/}
                    {/*) : (*/}
                    <FaPlay className="mt-1 me-2"/>
                    {/*)}*/}
                    Build & Run
                </div>
                {/*</ExternalLink>*/}
            </div>
        </OutputContainer>
    );
}