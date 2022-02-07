import React from 'react';
import {TUTORIALS} from '../../tutorials/tutorials';
import MenuModal from '../common/MenuModal';
import MenuModalOption from '../common/MenuModalOption';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import {FiX} from 'react-icons/fi';
import classNames from 'classnames';
import {onLeftClick} from '../../utils/eventHelpers';
import styled from 'styled-components';
import {EDITOR_MENU_STORE} from '../../observables/editorMenuStore';
import {isMobile} from 'react-device-detect';

const StyledMenuModalOption = styled(MenuModalOption)`
    transition: border-left-width .2s ease-out;
    border-style: solid;
    border-color: transparent;
    border-width: 4px ${p => p.selected ? 8 : 4}px;
    border-left-color: var(--bs-info);
`;

const tutorials = TUTORIALS;

export default function TutorialsModal() {
    const [progress, setProgress] = useTutorialProgressState();

    const currentTutorial = progress?.tutorial;

    return (
        <MenuModal title="Learning Resources">
            <MenuModalOption
                name={<span className="text-primary">Quick Reference</span>}
                description={
                    <>
                        View the basic controls and keywords.
                        {/*<span className="text-secondary">(shortcut: <code className="text-info">q</code>)</span>*/}
                    </>
                }
                {...onLeftClick(() => EDITOR_MENU_STORE.set('reference'))}>
            </MenuModalOption>
            {tutorials.map((tutorial, i) => {
                const selected = currentTutorial === tutorial;
                return (
                    <StyledMenuModalOption
                        key={i}
                        name={tutorial.name}
                        description={tutorial.description || '(No description provided)'}
                        className={classNames(selected && 'text-info')}
                        selected={selected}
                        {...onLeftClick(() => {
                            if(isMobile && !selected) {
                                EDITOR_MENU_STORE.set(null);
                            }
                            setProgress(selected ? null : {tutorial});
                        })}>
                        {selected && <span className="h5 mb-0 text-muted"><FiX/></span>}
                    </StyledMenuModalOption>
                );
            })}
        </MenuModal>
    );
}