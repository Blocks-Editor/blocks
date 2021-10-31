import TopMenu from '../common/menus/TopMenu';
import MenuButton from '../common/menus/MenuButton';
import {FaDownload, FaFileExport, FaFolder, FaSave} from 'react-icons/fa';
import React, {useContext, useState} from 'react';
import MenuItem from '../common/menus/MenuItem';
import styled, {keyframes} from 'styled-components';
import classNames from 'classnames';
import EventsContext, {
    PROJECT_LOAD_EVENT,
    EDITOR_SAVE_EVENT,
    PROJECT_EXPORT_EVENT,
    EDITOR_CHANGE_EVENT,
} from '../../contexts/EventsContext';
import useListener from '../../hooks/useListener';
import LoadProjectMenu from './LoadProjectMenu';
import {Modal} from 'react-bootstrap';
import {Folder, Save} from '@styled-icons/fa-solid';
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

const LoadIcon = styled(FaFolder)`
  transform: scale(.1);

  &.open {
    transform: scale(.9);
  }
`;

export default function EditorMenu({getEditor}) {
    const [name, setName] = useState('');
    const [saveAnimated, setSaveAnimated] = useState(false);
    const [loadMenuOpen, setLoadMenuOpen] = useState(false);

    const events = useContext(EventsContext);

    useListener(events, EDITOR_SAVE_EVENT, () => {
        setSaveAnimated(true);
    });

    useListener(events, PROJECT_LOAD_EVENT, project => {
        setName(project.name);
    });

    //////// temp
    setTimeout(() => {
        setName(getEditor().projectName);
    });

    const getExportData = () => {
        let json = getEditor().toJSON();
        return JSON.stringify({name, ...json});
    };

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
                    <ProjectNameInput
                        type="text"
                        placeholder="(Unnamed Project)"
                        className="text-secondary"
                        value={name || ''}
                        onChange={e => updateName(e.target.value)}
                    />
                    {/*<MenuButton onMouseDown={() => 'TODO: new'} data-tip="New Project"><FaFile/></MenuButton>*/}
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
                        onMouseDown={() => events.emit(PROJECT_EXPORT_EVENT, getExportData())}>
                        <FaDownload/>
                    </MenuButton>
                    <MenuButton
                        tooltip="Load Project"
                        onMouseDown={() => setLoadMenuOpen(!loadMenuOpen)}>
                        <LoadIcon className={classNames(loadMenuOpen && 'open')}/>
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