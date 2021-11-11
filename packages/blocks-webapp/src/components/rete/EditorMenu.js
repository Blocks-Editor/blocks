import TopMenu from '../common/menus/TopMenu';
import MenuButton from '../common/menus/MenuButton';
import React, {useContext, useState} from 'react';
import MenuItem from '../common/menus/MenuItem';
import styled, {keyframes} from 'styled-components';
import classNames from 'classnames';
import EventsContext, {
    EDITOR_CHANGE_EVENT,
    EDITOR_SAVE_EVENT,
    PROJECT_CLEAR_EVENT,
    PROJECT_EXPORT_EVENT,
    PROJECT_LOAD_EVENT,
} from '../../contexts/EventsContext';
import useListener from '../../hooks/useListener';
import LoadProjectMenu from './LoadProjectMenu';
import {Modal} from 'react-bootstrap';
import Icon from "../common/Icon";
import ReactTooltip from 'react-tooltip';

const ProjectNameInput = styled.input`
  background: var(--bs-light-rgb) !important;
  border: 2px solid transparent !important;
  border-bottom: solid 2px #0003 !important;
  font-weight: bold;
  vertical-align: top;
  margin-top: .4em;
  padding: .25em .25em .1em;
  position: relative;
  background-clip: padding-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(30deg, #00EFFB, #8649E1, #F900E3);
    margin: -2px;
    z-index: -1;
    opacity: 0;
  }

  :focus {
    outline: none;

    &::before {
      opacity: 1;
    }
  }
`;

const saveAnimation = keyframes`
  30% {
    transform: scale(.6);
  }
`;

const SaveIcon = styled(Icon)`
  &.animated {
    animation: ${saveAnimation} .8s ease-out;
  }
`;

export default function EditorMenu({getEditor, onLoadFileContent}) {
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
                {/*<Link to="/">*/}
                <MenuItem variant="dark">
                    <img src={`${process.env.PUBLIC_URL}/img/logo-gradient.png`} height="48px" alt="Blocks Logo"/>
                </MenuItem>
                {/*</Link>*/}
                <div className="d-flex flex-row justify-content-center align-items-center mx-3">
                    <ProjectNameInput
                        type="text"
                        placeholder="Unnamed Project"
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
                        {/*<FiDownload/>*/}
                        <Icon name="download"/>
                    </MenuButton>
                    <MenuButton
                        tooltip="New Project"
                        onMouseDown={() => events.emit(PROJECT_CLEAR_EVENT)}>
                        <Icon name="file-plus"/>
                    </MenuButton>
                    <MenuButton
                        tooltip="Load Project"
                        onMouseDown={() => setLoadMenuOpen(!loadMenuOpen)}>
                        {loadMenuOpen ? <Icon name="folder-open"/> : <Icon name="folder-wide"/>}
                    </MenuButton>
                </div>
            </TopMenu>
            <Modal
                // className=''
                show={loadMenuOpen}
                onShow={() => ReactTooltip.hide()}
                onHide={() => setLoadMenuOpen(false)}>
                <Modal.Body>
                    <LoadProjectMenu onLoadFileContent={onLoadFileContent}/>
                </Modal.Body>
            </Modal>
        </>
    );
}