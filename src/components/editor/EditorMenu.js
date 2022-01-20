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
    MenuIcon,
} from '../common/Icon';
import ReactTooltip from 'react-tooltip';
import AreaPlugin from 'rete-area-plugin';
import FloatingMenu from '../common/menus/FloatingMenu';
import SettingsModal from './SettingsModal';
import useOutputPanelState from '../../hooks/persistent/useOutputPanelState';
import useAutosaveState from '../../hooks/persistent/useAutosaveState';
import TutorialsModal from './TutorialsModal';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useEditorMenuState from '../../hooks/persistent/useEditorMenuState';
import useTimeout from '../../hooks/utils/useTimeout';
import SocialModal from './SocialModal';
import {onLeftClick, onLeftPress} from '../../utils/eventHelpers';
import {isMobile} from 'react-device-detect';
import {MOBILE_MENU_STORE} from '../../observables/mobileMenuStore';
import MobileMenu from '../common/menus/MobileMenu';
import MobileMenuButton from '../common/menus/MobileMenuButton';
import vibrate from '../../utils/vibrate';

const BlocksLogo = styled.img`
    -webkit-user-drag: none;
    user-select: none;
    height: 40px;
`;

const ProjectNameInput = styled.input`
    border: 1px solid transparent !important;
    border-radius: .5em;
    font-weight: bold;
    vertical-align: top;
    padding: .25em .5em .25em;
    position: relative;
    background-clip: padding-box;
    width: 100%;
    max-width: 200px;
    transition: border-color 0.1s;

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

const LogoContainer = styled(MenuItem)`
    padding: 0.6rem 0 0.6rem 1rem !important;
`;

const BetaMark = styled.a`
    font-size: 0.7rem;
    padding: 0.1rem 0 0 0.5rem;
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

    /// Temp, until project.details refactor
    useTimeout(() => {
        setName(editor.details.name);
    });

    // TODO refactor
    const updateName = (name) => {
        setName(name);
        editor.details.name = name;
        events.emit(EDITOR_CHANGE_EVENT, editor);
    };

    const saveAction = () => events.emit(EDITOR_SAVE_EVENT, editor);
    const exportAction = () => events.emit(PROJECT_EXPORT_EVENT, editor.toJSON());
    const newAction = () => events.emit(PROJECT_CLEAR_EVENT);
    const loadAction = () => setOpenMenu('load');
    const tutorialAction = () => setOpenMenu('tutorials');
    const settingsAction = () => setOpenMenu('settings');
    const socialAction = () => setOpenMenu('social');

    // Fix load menu always opening the "import a .blocks file" dialog on mobile
    const onClickMenuButton = isMobile ? onLeftClick : onLeftPress;

    // Close mobile menu when any option is selected
    const onClickMobileMenuButton = (call) => onClickMenuButton(() => {
        MOBILE_MENU_STORE.set(false);
        call();
    });

    return (
        <>
            <TopMenu>
                <LogoContainer className="d-inline-flex flex-row">
                    <a href="https://blocks-editor.github.io/" target="_blank" rel="noreferrer">
                        <BlocksLogo
                            className="d-none d-sm-block"
                            src={`${process.env.PUBLIC_URL}/img/logo-gradient.png`}
                            alt="Blocks logo"
                            draggable="false"
                        />
                        <BlocksLogo
                            className="d-block d-sm-none"
                            src={`${process.env.PUBLIC_URL}/img/icon-gradient.png`}
                            alt="Blocks icon"
                            draggable="false"
                        />
                    </a>
                    <BetaMark
                        href="https://github.com/Blocks-Editor/blocks"
                        target="_blank"
                        rel="noreferrer"
                        className="small text-muted text-decoration-none text-uppercase">
                        Beta
                    </BetaMark>
                </LogoContainer>
                <div className="w-100 px-3 py-2 py-sm-0 d-flex flex-row">
                    <ProjectNameInput
                        type="text"
                        placeholder="Unnamed Project"
                        className="d-inline-block bg-light mt-2 mt-sm-1 mb-2 mb-sm-1"
                        value={name || ''}
                        onChange={e => updateName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && events.emit(EDITOR_SAVE_EVENT, editor)}
                    />
                    <div className="d-flex d-lg-none flex-row justify-content-end align-items-center flex-grow-1">
                        <MenuButton
                            className="px-0"
                            tooltip="Menu"
                            noMargin
                            {...onClickMenuButton(() => MOBILE_MENU_STORE.set(true))}
                        >
                            <MenuIcon/>
                        </MenuButton>
                    </div>
                    <div className="w-100 d-none d-lg-flex flex-row justify-content-start align-items-center flex-grow-1">
                        {!autosave && (
                            <MenuButton
                                tooltip="Save Changes"
                                title="Save"
                                {...onClickMenuButton(saveAction)}>
                                <StyledSaveIcon
                                    className={classNames(saveAnimating && 'animating')}
                                    onAnimationEnd={() => setSaveAnimating(false)}
                                />
                            </MenuButton>
                        )}
                        <MenuButton
                            tooltip="Export to File"
                            title="Export"
                            {...onClickMenuButton(exportAction)}>
                            <DownloadIcon/>
                        </MenuButton>
                        <MenuButton
                            tooltip="New Project"
                            title="New"
                            {...onClickMenuButton(newAction)}>
                            <FilePlusIcon/>
                        </MenuButton>
                        <MenuButton
                            tooltip="Load Project"
                            title="Load"
                            {...onClickMenuButton(loadAction)}>
                            {openMenu === 'load' ? <FolderOpenIcon/> : <FolderWideIcon/>}
                        </MenuButton>
                        <MenuButton
                            tooltip="Tutorials"
                            title="Tutorials"
                            {...onClickMenuButton(tutorialAction)}>
                            <StyledLearningIcon className={classNames(!!progress && 'enabled')}/>
                        </MenuButton>
                        <MenuButton
                            tooltip="Options"
                            title="Options"
                            {...onClickMenuButton(settingsAction)}>
                            <SettingsIcon/>
                        </MenuButton>
                        <MenuButton
                            tooltip="Social"
                            title="Social"
                            {...onClickMenuButton(socialAction)}>
                            <StyledSocialIcon/>
                        </MenuButton>
                    </div>
                </div>
            </TopMenu>
            <MobileMenu>
                {!autosave && (
                    <MobileMenuButton {...onClickMobileMenuButton(saveAction)}>
                        <StyledSaveIcon
                            className={classNames(saveAnimating && 'animating')}
                            onAnimationEnd={() => setSaveAnimating(false)}
                        />
                        <span className="px-3 pt-1">Save Changes</span>
                    </MobileMenuButton>
                )}
                <MobileMenuButton {...onClickMobileMenuButton(exportAction)}>
                    <DownloadIcon/>
                    <span className="px-3 pt-1">Export to File</span>
                </MobileMenuButton>
                <MobileMenuButton {...onClickMobileMenuButton(newAction)}>
                    <FilePlusIcon/>
                    <span className="px-3 pt-1">New Project</span>
                </MobileMenuButton>
                <MobileMenuButton {...onClickMobileMenuButton(loadAction)}>
                    {openMenu === 'load' ? <FolderOpenIcon/> : <FolderWideIcon/>}
                    <span className="px-3 pt-1">Load Project</span>
                </MobileMenuButton>
                <hr/>
                <MobileMenuButton {...onClickMobileMenuButton(tutorialAction)}>
                    <StyledLearningIcon className={classNames(!!progress && 'enabled')}/>
                    <span className="px-3 pt-1">Tutorials</span>
                </MobileMenuButton>
                <MobileMenuButton {...onClickMobileMenuButton(settingsAction)}>
                    <SettingsIcon/>
                    <span className="px-3 pt-1">Options</span>
                </MobileMenuButton>
                <MobileMenuButton {...onClickMobileMenuButton(socialAction)}>
                    <StyledSocialIcon/>
                    <span className="px-3 pt-1">Social</span>
                </MobileMenuButton>
            </MobileMenu>
            <FloatingMenu bottom left>
                <MenuButton
                    className="round d-flex align-items-center justify-content-center"
                    tooltip="Reset Viewport"
                    {...onClickMenuButton(() => {
                        AreaPlugin.zoomAt(editor);
                        setZoomAnimating(true);
                        vibrate(50);
                    })}>
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
                    {...onClickMenuButton(() => setOutputPanel(!outputPanel))}>
                    <small>Compile</small>
                </MenuButton>
            </FloatingMenu>
            <Modal
                show={openMenu}
                onShow={() => ReactTooltip.hide()}
                onHide={() => setOpenMenu(null)}>
                <Modal.Body className="bg-light rounded-1">
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