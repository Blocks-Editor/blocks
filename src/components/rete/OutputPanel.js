import React, {useContext, useState} from 'react';
import Dock from 'react-dock';
import styled from 'styled-components';
import {FiClipboard, FiX} from 'react-icons/fi';
import CodeEditor from '../monaco/CodeEditor';
import compileGlobalMotoko from '../../utils/compileGlobalMotoko';
import EventsContext, {EDITOR_CHANGE_EVENT} from '../../contexts/EventsContext';
import useOutputPanelVisibleState from '../../hooks/settings/useOutputPanelVisibleState';
import useListener from '../../hooks/utils/useListener';

const OutputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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
    const [output, setOutput] = useState('');

    const events = useContext(EventsContext);

    useListener(events, EDITOR_CHANGE_EVENT, () => setOutput(getOutput));

    return (
        <Dock className="output-panel" position="right" isVisible={visible} fluid={true} dimMode="none">
            <OutputContainer className="p-3">
                <div className="d-flex">
                    <div className="clickable px-2" onClick={() => setVisible(false)}>
                        <FiX size={18}/>
                    </div>
                    <h3 className="ms-3">Compiled Output</h3>
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
        </Dock>
    );
}