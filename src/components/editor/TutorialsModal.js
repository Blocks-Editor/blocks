import React from 'react';
import {TUTORIALS} from '../../tutorials/tutorials';
import MenuModal from '../common/MenuModal';
import MenuModalOption from '../common/MenuModalOption';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import {FiX} from 'react-icons/fi';
import classNames from 'classnames';
import {SHORTCUT_KEYS} from '../../editor/shortcutKeys';
import getBlockLabel from '../../utils/getBlockLabel';
import styled from 'styled-components';

const tutorials = TUTORIALS;

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
                    <KeyContainer className={classNames(className)} {...others}>
                        {key}
                    </KeyContainer>
                </label>
            ))}
        </ShortcutContainer>
    );
}

const BlockShortcutContainer = styled.div`
    padding: .5rem 1rem;
    background: #0001;
    max-height: 20rem;
    overflow-y: auto;
`;

export default function TutorialsModal() {
    const [progress, setProgress] = useTutorialProgressState();

    const currentTutorial = progress?.tutorial;

    return (
        <MenuModal title="Tutorials">
            {tutorials.map((tutorial, i) => {
                const selected = currentTutorial === tutorial;
                return (
                    <MenuModalOption
                        key={i}
                        name={tutorial.name}
                        description={tutorial.description || '(No description provided)'}
                        className={classNames(selected && 'text-info')}
                        style={{
                            transition: 'border-left-width .2s ease-out',
                            borderStyle: 'solid',
                            borderColor: 'transparent',
                            borderWidth: `4px ${selected ? 8 : 4}px`,
                            borderLeftColor: 'var(--bs-info)',
                        }} // TODO: refactor to styled-components
                        onClick={() => setProgress(selected ? null : {tutorial})}>
                        {selected && <span className="h5 mb-0 text-muted"><FiX/></span>}
                    </MenuModalOption>
                );
            })}
            <h3 className="mt-4 fw-light">Keyboard Shortcuts</h3>
            <hr/>
            <BlockShortcutContainer>
                <KeyboardShortcut binding={['left mouse']}>
                    Select & Drag
                </KeyboardShortcut>
                <KeyboardShortcut binding={['right mouse']}>
                    Context Menu
                </KeyboardShortcut>
                <KeyboardShortcut binding={['ctrl', 'right mouse']}>
                    Context Menu (+)
                </KeyboardShortcut>
                {[...SHORTCUT_KEYS.keys()].sort().map(key => (
                    <KeyboardShortcut key={key} binding={key}>
                        <span className="text-muted">{getBlockLabel(SHORTCUT_KEYS.get(key))}</span>
                    </KeyboardShortcut>
                ))}
            </BlockShortcutContainer>
        </MenuModal>
    );
}