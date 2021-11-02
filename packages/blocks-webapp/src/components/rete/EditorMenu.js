import TopMenu from '../common/menus/TopMenu';
import MenuButton from '../common/menus/MenuButton';
import {FaDownload, FaFile, FaFolder, FaFolderOpen, FaSave} from 'react-icons/fa';
import React, {useContext, useState} from 'react';
import MenuItem from '../common/menus/MenuItem';
import styled, {keyframes} from 'styled-components';
import classNames from 'classnames';
import EventsContext, {
    EDITOR_CHANGE_EVENT,
    EDITOR_SAVE_EVENT, PROJECT_CLEAR_EVENT,
    PROJECT_EXPORT_EVENT,
    PROJECT_LOAD_EVENT,
} from '../../contexts/EventsContext';
import useListener from '../../hooks/useListener';
import LoadProjectMenu from './LoadProjectMenu';
import {Modal} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const ProjectNameInput = styled.input`
  background: none !important;
  border: none !important;
  border-bottom: solid 2px #0005 !important;
  font-weight: bold;
  vertical-align: top;
  margin-top: .4em;
  padding: .25em .25em .1em;

  :focus {
    background: #0001 !important;
  }
`;

const saveAnimation = keyframes`
  30% {
    transform: scale(.9);
  }
`;

const SaveIcon = styled(FaSave)`
  &.animated {
    animation: ${saveAnimation} .5s ease-out;
  }
`;

export default function EditorMenu({getEditor}) {
    const [name, setName] = useState('');
    const [saveAnimated, setSaveAnimated] = useState(false); // TODO: possibly generalize to MenuButton
    const [loadMenuOpen, setLoadMenuOpen] = useState(false);

    const events = useContext(EventsContext);

    useListener(events, EDITOR_SAVE_EVENT, () => {
        setSaveAnimated(true);
    });

    useListener(events, PROJECT_LOAD_EVENT, project => {
        setName(project.name);
        setLoadMenuOpen(false);
    });

    /// Temp, until projectName refactor
    setTimeout(() => {
        setName(getEditor().projectName);
    });

    // TODO refactor
    const updateName = (name) => {
        setName(name);
        let editor = getEditor();
        editor.projectName = name;
        events.emit(EDITOR_CHANGE_EVENT, editor);
    };

    return (
        <>
            <TopMenu>
                <Link to="/">
                    <MenuItem variant="primary">
                        BLOCKS.
                    </MenuItem>
                </Link>
                <div className="d-inline-block mx-auto">
                    <MenuButton onMouseDown={() => events.emit(PROJECT_CLEAR_EVENT)} data-tip="New Project">
                        <FaFile/>
                    </MenuButton>
                    <ProjectNameInput
                        type="text"
                        placeholder="(Unnamed Project)"
                        className="text-secondary"
                        value={name || ''}
                        onChange={e => updateName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && events.emit(EDITOR_SAVE_EVENT, getEditor())}
                    />
                    <MenuButton
                        tooltip="Save Changes"
                        onMouseDown={() => events.emit(EDITOR_SAVE_EVENT, getEditor())}>
                        <SaveIcon
                            className={classNames(saveAnimated && 'animated')}
                            onAnimationEnd={() => setSaveAnimated(false)}
                        />
                    </MenuButton>
                    <MenuButton
                        tooltip="Export to File"
                        onMouseDown={() => events.emit(PROJECT_EXPORT_EVENT, getEditor().toJSON())}>
                        <FaDownload/>
                    </MenuButton>
                    <MenuButton
                        tooltip="Load Project"
                        onMouseDown={() => setLoadMenuOpen(!loadMenuOpen)}>
                        {loadMenuOpen ? <FaFolderOpen/> : <FaFolder/>}
                    </MenuButton>
                </div>
            </TopMenu>
            <Modal
                // className=''
                show={loadMenuOpen}
                onHide={() => setLoadMenuOpen(false)}>
                <Modal.Body>
                    <LoadProjectMenu/>
                </Modal.Body>
            </Modal>
        </>
    );
}