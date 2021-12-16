import React from 'react';
import {TUTORIALS} from '../../tutorials/tutorials';
import MenuModal from '../common/MenuModal';
import MenuModalOption from '../common/MenuModalOption';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import {FiX} from 'react-icons/fi';
import classNames from 'classnames';

const tutorials = TUTORIALS;

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
                        onClick={() => setProgress(selected ? null : {tutorial})}>
                        {selected && <span className="h5 mb-0 text-muted"><FiX/></span>}
                    </MenuModalOption>
                );
            })}
            {/*<hr/>*/}
            {/*{SHORTCUT_KEYS.entries().map((key, block) => (*/}
            {/*    <div key={key} className="d-flex align-items-center">*/}
            {/*        <label className="flex-grow-1">{key}</label>*/}
            {/*        <span>{getBlockLabel(block)}</span>*/}
            {/*    </div>*/}
            {/*))}*/}
        </MenuModal>
    );
}