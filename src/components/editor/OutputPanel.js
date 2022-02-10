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
import parseGithubPackage from '../../utils/parseGithubPackage';

const topOffset = isMobile ? 0 : 66; // Magic temporary number

const OutputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: ${topOffset}px;
    bottom: 0;
    right: 0;
    width: 40%;
    height: calc(100% - ${topOffset}px); // Prevents scrollbar
    padding-bottom: ${isMobile ? 60 : 0}px;
    transition: 0.4s;
    z-index: 1000;
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
    // const [test, setTest] = useState(true);
    const test = true;

    const events = useContext(EventsContext);

    const closed = !panel;

    const compileOptions = {test};

    // Generate output source code
    const getOutput = () => compileGlobalMotoko(editor, compileOptions);

    const handleOpenPlayground = () => {
        try {
            const playgroundKey = Math.random().toString(16).substr(2, 12);
            const playgroundWindow = window.open(`${playgroundOrigin}?post=${playgroundKey}`, 'motokoPlayground');
            // const playgroundKey = 'blocks';

            // Interval index used as acknowledge key
            let attempts = 0;
            const ack = setInterval(() => {
                attempts++;
                if(attempts > 100) {
                    endAcknowledgement();
                }

                const packages = editor.nodes.filter(node => node.name === 'GithubPackage')
                    .map(node => {
                        const packageInfo = parseGithubPackage(node.data.repository, node.data.name);
                        return packageInfo && {
                            ...packageInfo,
                            repo: `https://github.com/${packageInfo.repo}.git`,
                        };
                    })
                    .filter(x => x);

                const files = {
                    'Main.mo': compileGlobalMotoko(editor, compileOptions),
                };
                if(test) {
                    files['Main_WithoutTests.mo'] = compileGlobalMotoko(editor);
                }

                playgroundWindow.postMessage(`${playgroundKey}${JSON.stringify({
                    type: 'workplace',
                    acknowledge: ack,
                    packages,
                    deploy: true,
                    actions: [
                        // Load project source code
                        {
                            type: 'loadProject',
                            payload: {
                                files,
                            },
                        },
                    ],
                })}`, playgroundOrigin);
            }, 500);

            const responseListener = ({source, origin, data}) => {
                if(source === playgroundWindow && origin === playgroundOrigin && typeof data === 'string' && data.startsWith(playgroundKey)) {
                    try {
                        const message = JSON.parse(data.substring(playgroundKey.length));
                        if(message.acknowledge === ack) {
                            endAcknowledgement(message);
                        }
                    }
                    catch(err) {
                        events.emit(err);
                    }
                }
            };
            window.addEventListener('message', responseListener, false);

            const endAcknowledgement = (message) => {
                if(!message) {
                    console.warn('No acknowledgement for', playgroundKey);
                }
                clearInterval(ack);
                window.removeEventListener('message', responseListener);
            };
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
            <div className="flex-grow-1" style={{paddingLeft: isMobile && '1rem'}}>
                <CodeEditor value={output} readOnly options={{lineNumbers: isMobile ? 'off' : undefined}}/>
            </div>
            <div className="bottom-bar py-2">
                {/*{hasTestCases(editor) && (*/}
                {/*    <div className="mb-2 d-flex justify-content-end">*/}
                {/*        <Checkbox value={test} onChange={test => setTest(test) & setOutput('') /* Recompile output *!/>*/}
                {/*            Include test cases*/}
                {/*        </Checkbox>*/}
                {/*    </div>*/}
                {/*)}*/}
                <div className="d-flex flex-row align-items-center justify-content-between">
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
                    <div
                        className="btn btn-outline-success d-flex justify-content-center"
                        data-tip="Run and deploy your smart contract on Motoko Playground."
                        {...onLeftClick(handleOpenPlayground)}>
                        <FaPlay className="mt-1 me-2"/>
                        Build & Run
                    </div>
                </div>
            </div>
        </OutputContainer>
    );
}