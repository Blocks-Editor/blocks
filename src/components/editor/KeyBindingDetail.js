import styled from 'styled-components';
import classNames from 'classnames';
import React from 'react';
import {SHORTCUT_KEY_MAP} from '../../editor/shortcutKeys';
import getBlockLabel from '../../utils/getBlockLabel';

const BlockShortcutContainer = styled.div`
    padding: .5rem 1rem;
    background: #0001;
    max-height: 20rem;
    overflow-y: auto;
    border-radius: 0.25rem;
`;

const ShortcutContainer = styled.div`
    font-weight: 500;

    :hover {
        background: #0001;
    }
`;

const KeyContainer = styled.code`
    background: #0001;
    padding: .25rem .5rem;
    border-radius: .5rem;
    white-space: nowrap;
`;

function KeyboardShortcut({binding, className, children, ...others}) {
    return (
        <ShortcutContainer className="p-1 d-flex align-items-center">
            <label className="mb-0 flex-grow-1">{children}</label>
            {(Array.isArray(binding) ? binding : [binding]).map((key, i) => (
                <label key={`${key}${i}`} className="ms-1">
                    {/*{i > 0 && <span>+</span>}*/}
                    <KeyContainer className={classNames(className, 'text-info')} {...others}>
                        {key}
                    </KeyContainer>
                </label>
            ))}
        </ShortcutContainer>
    );
}

export default function KeyBindingDetail() {
    return (
        <BlockShortcutContainer>
            <KeyboardShortcut binding={['q']}>
                Quick Reference
            </KeyboardShortcut>
            <KeyboardShortcut binding={['left mouse']}>
                Select & Drag
            </KeyboardShortcut>
            <KeyboardShortcut binding={['right mouse']}>
                Context Menu
            </KeyboardShortcut>
            <KeyboardShortcut binding={['ctrl', 'right mouse']}>
                Context Menu (+)
            </KeyboardShortcut>
            <KeyboardShortcut binding={'delete'}>
                Delete Selected Blocks
            </KeyboardShortcut>
            <KeyboardShortcut binding={['ctrl', 'left mouse']}>
                Remove Connection
            </KeyboardShortcut>
            {[...SHORTCUT_KEY_MAP.keys()].sort().map(key => (
                <KeyboardShortcut key={key} binding={key}>
                    <span className="text-secondary">{getBlockLabel(SHORTCUT_KEY_MAP.get(key))}</span>
                </KeyboardShortcut>
            ))}
        </BlockShortcutContainer>
    );
}