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
import useListener from '../../hooks/utils/useListener';
import LoadProjectModal from './LoadProjectModal';
import {Modal} from 'react-bootstrap';
import {
    CrosshairIcon,
    DownloadIcon,
    FilePlusIcon,
    FolderOpenIcon,
    FolderWideIcon,
    LearningIcon,
    SaveIcon,
    SettingsIcon,
    SocialIcon,
} from '../common/Icon';
import ReactTooltip from 'react-tooltip';
import AreaPlugin from 'rete-area-plugin';
import FloatingMenu from '../common/menus/FloatingMenu';
import SettingsModal from './SettingsModal';
import useOutputPanelState from '../../hooks/persistent/useOutputPanelState';
import useAutosaveState from '../../hooks/persistent/useAutosaveState';
import TutorialCard from './TutorialCard';
import TutorialsModal from './TutorialsModal';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useEditorMenuState from '../../hooks/persistent/useEditorMenuState';
import useTimeout from '../../hooks/utils/useTimeout';
import SocialModal from './SocialModal';

const BlocksLogo = styled.img`
    -webkit-user-drag: none;
    user-select: none;
    height: 40px;
`;

const ProjectNameInput = styled.input`
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

// TODO: define animated icons in their own files
const saveAnimation = keyframes`
    30% {
        transform: scale(.6);
    }
`;
const StyledSaveIcon = styled(SaveIcon)`
    &.animating {
        animation: ${saveAnimation} .7s ease-out;
    }
`;

// const zoomAnimation = keyframes`
//     from {
//         transform: rotate(0);
//     }
//     to {
//         transform: rotate(360deg);
//     }
// `;
const StyledZoomIcon = styled(CrosshairIcon)`
    &.animating {
        animation: ${saveAnimation} .7s ease-out;
    }
`;

const StyledLearningIcon = styled(LearningIcon)`
    transition: .2s transform ease-out;

    &.enabled {
        //stroke: var(--bs-primary) !important;
        //transform: scale(1.3) !important;
        //box-shadow: 0 0 12px inset #0003;
        //border-radius: 50%;
        //outline: 2px solid var(--bs-primary);
    }
`;

const StyledSocialIcon = styled(SocialIcon)`
    // Temporary
    .menu-item:hover & {
        color: #FFF8;
    }
`;

export default function EditorMenu({editor}) {
    const [name, setName] = useState('');
    const [saveAnimating, setSaveAnimating] = useState(false);
    const [zoomAnimating, setZoomAnimating] = useState(false);
    const [openMenu, setOpenMenu] = useEditorMenuState();
    const [outputPanel, setOutputPanel] = useOutputPanelState();
    const [autosave] = useAutosaveState();
    const [progress] = useTutorialProgressState();

    const events = useContext(EventsContext);

    useListener(events, EDITOR_SAVE_EVENT, () => {
        setSaveAnimating(true);
    });

    useListener(events, PROJECT_LOAD_EVENT, project => {
        setName(project.name);
        setOpenMenu(false);
    });

    /// Temp, until projectName refactor
    useTimeout(() => {
        setName(editor.projectName);
    });

    // TODO refactor
    const updateName = (name) => {
        setName(name);
        editor.projectName = name;
        events.emit(EDITOR_CHANGE_EVENT, editor);
    };

    const betaSymbol = 'β';

    return (
        <>
            <TopMenu>
                <MenuItem className="d-none d-sm-block">
                    <a href="https://blocks-editor.github.io/" target="_blank" rel="noreferrer">
                        <BlocksLogo
                            className="pt-1"
                            src={`${process.env.PUBLIC_URL}/img/logo-gradient.png`}
                            alt="Blocks Logo"
                            draggable="false"
                        />
                    </a>
                </MenuItem>
                <div className="w-100 px-3">
                    <ProjectNameInput
                        type="text"
                        placeholder="Unnamed Project"
                        className="d-block d-sm-inline-block bg-light text-secondary mb-2 mb-sm-0"
                        value={name || ''}
                        onChange={e => updateName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && events.emit(EDITOR_SAVE_EVENT, editor)}
                    />
                    {!autosave && (
                        <MenuButton
                            tooltip="Save Changes"
                            onMouseDown={() => events.emit(EDITOR_SAVE_EVENT, editor)}>
                            <StyledSaveIcon
                                className={classNames(saveAnimating && 'animating')}
                                onAnimationEnd={() => setSaveAnimating(false)}
                            />
                        </MenuButton>
                    )}
                    <MenuButton
                        tooltip="Export to File"
                        onMouseDown={() => events.emit(PROJECT_EXPORT_EVENT, editor.toJSON())}>
                        <DownloadIcon/>
                    </MenuButton>
                    <MenuButton
                        tooltip="New Project"
                        onMouseDown={() => events.emit(PROJECT_CLEAR_EVENT)}>
                        <FilePlusIcon/>
                    </MenuButton>
                    <MenuButton
                        tooltip="Load Project"
                        onMouseDown={() => setOpenMenu('load')}>
                        {openMenu === 'load' ? <FolderOpenIcon/> : <FolderWideIcon/>}
                    </MenuButton>
                    <MenuButton
                        tooltip="Tutorials"
                        onMouseDown={() => setOpenMenu('tutorials')}>
                        <StyledLearningIcon className={classNames(!!progress && 'enabled')}/>
                    </MenuButton>
                    <MenuButton
                        tooltip="Options"
                        onMouseDown={() => setOpenMenu('settings')}>
                        <SettingsIcon/>
                    </MenuButton>
                    <MenuButton
                        tooltip="Social"
                        onMouseDown={() => setOpenMenu('social')}>
                        <StyledSocialIcon/>
                    </MenuButton>
                    <a
                        className="float-md-end text-center text-muted"
                        href="https://github.com/Blocks-Editor/blocks"
                        target="_blank"
                        rel="noreferrer">
                        {/*<MenuButton*/}
                        {/*    className="px-2"*/}
                        {/*    tooltip="Blocks is currently in Open Beta testing."*/}
                        {/*    data-place="left">*/}
                        {/*    <FaGithub/>*/}
                        {/*</MenuButton>*/}
                        <MenuItem
                            className="px-4 opacity-50"
                            tooltip="Blocks is currently in Open Beta testing."
                            data-place="left">
                            {betaSymbol}
                        </MenuItem>
                    </a>
                </div>
            </TopMenu>
            <FloatingMenu top left>
                <TutorialCard/>
            </FloatingMenu>
            <FloatingMenu bottom left>
                <MenuButton
                    className="round d-flex align-items-center justify-content-center"
                    tooltip="Reset Viewport"
                    onMouseDown={() => {
                        AreaPlugin.zoomAt(editor);
                        setZoomAnimating(true);
                    }}>
                    <StyledZoomIcon
                        className={classNames(zoomAnimating && 'animating')}
                        onAnimationEnd={() => setZoomAnimating(false)}
                    />
                </MenuButton>
            </FloatingMenu>
            <FloatingMenu bottom right>
                <MenuButton
                    className="compile-button text-uppercase h4 text-muted"
                    tooltip="Compile to Motoko"
                    onMouseDown={() => setOutputPanel(!outputPanel)}>
                    <small>Compile</small>
                </MenuButton>
            </FloatingMenu>
            <Modal
                show={openMenu}
                onShow={() => ReactTooltip.hide()}
                onHide={() => setOpenMenu(null)}>
                <Modal.Body>
                    {openMenu === 'load' && (
                        <LoadProjectModal/>
                    )}
                    {openMenu === 'tutorials' && (
                        <TutorialsModal/>
                    )}
                    {openMenu === 'settings' && (
                        <SettingsModal/>
                    )}
                    {openMenu === 'social' && (
                        <SocialModal/>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}