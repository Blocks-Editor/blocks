import React from 'react';
import useThemeState from '../../hooks/persistent/useThemeState';
import useThemes from '../../hooks/useThemes';
import useLearningModeState from '../../hooks/persistent/useLearningModeState';
import {sentenceCase} from 'change-case';
import useThemePartsState from '../../hooks/persistent/useThemePartsState';
import styled from 'styled-components';
import useAutosaveState from '../../hooks/persistent/useAutosaveState';
import MenuModal from '../common/MenuModal';
import KeyBindingDetail from './KeyBindingDetail';
import useTelemetryState from '../../hooks/persistent/useTelemetryState';
import useButtonTitleState from '../../hooks/persistent/useButtonTitleState';
import classNames from 'classnames';

const settingInputs = {
    select({value, options, onChange}) {
        return (
            <select className="form-control ml-5 w-auto" onChange={onChange} value={value}>
                {options.map((option, i) => (
                        <option key={i} value={option.value}>{option.label ?? option.value}</option>
                    ),
                )}
            </select>
        );
    },
    toggle({value, onChange}) {
        return (
            <input type="checkbox" checked={!!value} onChange={onChange}/>
        );
    },
};

const NestedContainer = styled.div`
    background: #0001;
`;

/**
 * Creates a UI element for a given setting.
 */
function Setting({name, description, note, type, extras, props}) {

    const SettingInput = settingInputs[type];

    return (
        <>
            <div className="w-100 py-1 px-3 d-flex flex-column align-items-start justify-content-center">
                <div className="w-100 d-flex flex-row align-items-center justify-content-between">
                    <span className="flex-grow-1" style={{fontWeight: 500}}>{name}</span>
                    {SettingInput && <SettingInput {...props}/>}
                </div>
                <div className="d-flex small text-secondary align-content-between w-100">
                    <div className="flex-grow-1">{description}</div>
                    {!!note && <div>{note}</div>}
                </div>
            </div>
            {extras && !!extras.length && (
                <NestedContainer className="ps-3 py-1 rounded-3">
                    {extras.map((extra, i) => <Setting key={i} {...extra}/>)}
                </NestedContainer>
            )}
        </>
    );
}

export default function SettingsModal() {
    const [theme, setTheme] = useThemeState();
    const [themeParts, setThemeParts] = useThemePartsState();
    const [autosave, setAutosave] = useAutosaveState();
    const [learningMode, setLearningMode] = useLearningModeState();
    const [telemetry, setTelemetry] = useTelemetryState();
    const [buttonTitles, setButtonTitles] = useButtonTitleState();
    // const [telemetryChanged, setTelemetryChanged] = useState(false);

    const themes = useThemes();

    // Define the content for each option.
    const settings = [{
        name: 'Theme',
        description: 'The color scheme used in the editor.',
        type: 'select',
        props: {
            label: theme.name,
            value: theme.id,
            options: themes.map(theme => ({value: theme.id, label: theme.name})),
            onChange(e) {
                setTheme(e.target.value);
            },
        },
        extras: theme.parts.map(part => ({
            name: sentenceCase(part),
            type: 'toggle',
            props: {
                value: !!themeParts[part],
                onChange() {
                    setThemeParts({...themeParts, [part]: !themeParts[part]});
                },
            },
        })),
    }, {
        name: 'Auto-save changes',
        description: 'Automatically sync changes while using the editor.',
        type: 'toggle',
        props: {
            value: autosave,
            onChange() {
                setAutosave(!autosave);
            },
        },
    }, {
        name: 'Learning Mode',
        description: 'Show more details in mouse-over tooltips.',
        type: 'toggle',
        props: {
            value: learningMode,
            onChange() {
                setLearningMode(!learningMode);
            },
        },
    }, {
        name: 'Display button names',
        description: 'Show the title of each button in the top menu.',
        type: 'toggle',
        hideMobile: true,
        props: {
            value: buttonTitles,
            onChange() {
                setButtonTitles(!buttonTitles)
            }
        }
    }, {
        name: 'Send anonymized usage statistics',
        description: 'Help us improve the Blocks Editor.',
        type: 'toggle',
        props: {
            value: telemetry,
            onChange() {
                setTelemetry(!telemetry);
                // setTelemetryChanged(true);
            },
        },
        // note: telemetry
        //     ? <FaRegSmileBeam className="text-success" title="Thank you!"/>
        //     : telemetry !== null && <FaRegSadCry title=":("/>,
    }];

    return (
        <MenuModal title="Options">
            {settings.map((setting, i) => (
                <div key={i}>
                    <Setting className={classNames('d-md-block', {'d-none': setting.hideMobile})} {...setting}/>
                    <hr/>
                </div>
            ))}
            <h4 className="mt-4 mb-3 fw-normal">Keyboard Shortcuts</h4>
            <KeyBindingDetail/>
            <div className="h5 fw-normal mt-4 mb-0 w-100">
                <a href="https://github.com/Blocks-Editor/blocks" target="_blank" rel="noreferrer" className="p-2 rounded text-secondary small w-100">
                    Blocks is currently in open beta.
                </a>
            </div>

        </MenuModal>
    );
}