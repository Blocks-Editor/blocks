import React, {useContext} from 'react';
import Dock from 'react-dock';
import styled from 'styled-components';
import {FiClipboard, FiX} from 'react-icons/fi';
import CodeEditor from '../monaco/CodeEditor';
import OutputPanelContext from '../../contexts/OutputPanelContext';

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

export default function OutputPanel() {

    const {isVisible, setVisible} = useContext(OutputPanelContext);

    return (
        <Dock className="output-panel" position="right" isVisible={isVisible} dockStyle={{}} fluid={true}>
            <OutputContainer className="p-3">
                <div className="clickable pb-3" onClick={() => setVisible(!isVisible)}>
                    <FiX size={18}/>
                </div>
                <h3>Compiled Output</h3>
                <div className="flex-grow-1 text-muted">
                    <CodeEditor value={'test()'} readOnly={true}/>
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