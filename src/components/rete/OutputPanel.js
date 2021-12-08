import React, {useContext, useState} from 'react';
import classNames from 'classnames';
import styled, {css} from 'styled-components';
import {FiClipboard, FiX, FiMaximize2} from 'react-icons/fi';
import CodeEditor from '../monaco/CodeEditor';
import compileGlobalMotoko from '../../utils/compileGlobalMotoko';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../contexts/EventsContext';
import useOutputPanelVisibleState from '../../hooks/settings/useOutputPanelVisibleState';
import useFullscreenPanelState from '../../hooks/settings/useFullscreenPanelState';
import useListener from '../../hooks/utils/useListener';

const OutputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 40%;
    transition: 0.4s;
    z-index: 100;
    padding-top: 95px;
    
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

export default function OutputPanel({getEditor}) {

    // Get current output source code
    const getOutput = () => {
        return compileGlobalMotoko(getEditor());
    };

    const [visible, setVisible] = useOutputPanelVisibleState();
    const [fullscreen, setFullscreen] = useFullscreenPanelState();
    const [output, setOutput] = useState('');

    const events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => setOutput(getOutput));

    return (
        <OutputContainer className={classNames('output-panel p-3')} closed={!visible} fullscreen={fullscreen === 'output'}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="clickable px-2" onClick={() => setVisible(false)}>
                    <FiX size={18}/>
                </div>
                <h3 className="mx-3 mb-0">Compiled Output</h3>
                <div className="clickable px-2" onClick={() => setFullscreen(!fullscreen ? 'output' : false)}>
                    <FiMaximize2 size={18} />
                </div>
            </div>
            <div className="flex-grow-1 text-muted">
                <CodeEditor value={output} readOnly={true}/>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center">
                <ClipboardButton className="d-flex flex-row align-items-center justify-content-center py-2 px-3 clickable">
                    <FiClipboard className="mb-1" style={{marginRight: '0.5rem'}}/>
                    <small>Copy to Clipboard</small>
                </ClipboardButton>
            </div>
        </OutputContainer>
    );
}