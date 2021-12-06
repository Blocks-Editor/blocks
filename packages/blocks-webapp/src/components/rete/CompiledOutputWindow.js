import React, {useState} from 'react';
import Dock from 'react-dock';
import styled from 'styled-components';
import {FiX, FiClipboard} from 'react-icons/all';
import useThemeState from '../../hooks/settings/useThemeState';

const OutputWindowContent = styled.div`
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

function getStyleByTheme(theme) {
    switch(theme) {
        case 'light':
            return {
                backgroundColor: '#FFF',
                color: 'rgb(33, 37, 41)'
            }
        case 'dark':
        default:
            return {
                backgroundColor: '#022030',
                borderLeft: '3px solid #00131C',
                color: '#FFF'
            }
    }
}

export default function CompiledOutputWindow({isVisible, setVisible}) {

    console.log(setVisible);

    const [theme] = useThemeState();

    return (
        <Dock position='right' isVisible={isVisible} className="output-window" dockStyle={getStyleByTheme(theme.id)}>
            <OutputWindowContent className="p-3">
                <div className="clickable pb-3" onClick={() => {setVisible(!isVisible)}}><FiX size={18} /></div>
                <h3>Compiled Output</h3>
                <div className="flex-grow-1 text-muted">
                    this div is a placeholder for where the code goes...
                </div>
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <ClipboardButton className="d-flex flex-row align-items-center justify-content-center py-2 px-3 clickable">
                        <FiClipboard className="mb-1" style={{marginRight: '0.5rem'}} />
                        <small>Copy to Clipboard</small>
                    </ClipboardButton>
                </div>
            </OutputWindowContent>
        </Dock>
    )
}