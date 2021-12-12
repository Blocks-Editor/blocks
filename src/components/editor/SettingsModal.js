import React from 'react';
import useThemeState from '../../hooks/persistent/useThemeState';
import useThemes from '../../hooks/useThemes';
import useLearningModeState from '../../hooks/persistent/useLearningModeState';
import {sentenceCase} from 'change-case';
import useThemePartsState from '../../hooks/persistent/useThemePartsState';
import styled from 'styled-components';
import useAutosaveState from '../../hooks/persistent/useAutosaveState';

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
function Setting({name, description, type, extras, props}) {

    const SettingInput = settingInputs[type];

    return (
        <>
            <div className="w-100 py-1 px-3 d-flex flex-column align-items-start justify-content-center">
                <div className="w-100 d-flex flex-row align-items-center justify-content-between">
                    <span className="flex-grow-1" style={{fontWeight: 600}}>{name}</span>
                    {SettingInput && <SettingInput {...props}/>}
                </div>
                <span className="small text-muted">{description}</span>
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
        description: 'Provides more detailed mouse-over tooltips.',
        type: 'toggle',
        props: {
            value: learningMode,
            onChange() {
                setLearningMode(!learningMode);
            },
        },
    }];

    return (
        <div className="p-3">
            <h3 className="fw-light">Settings</h3>
            {settings.map((setting, i) => (
                <div key={i}>
                    <hr/>
                    <Setting {...setting}/>
                </div>
            ))}
        </div>
    );
}