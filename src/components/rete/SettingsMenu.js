import React from 'react';
import useThemeState from '../../hooks/settings/useThemeState';
import useThemes from '../../hooks/useThemes';
import useAdvancedPropsState from '../../hooks/settings/useAdvancedPropsState';
import useLearningModeState from '../../hooks/settings/useLearningModeState';
import {sentenceCase} from 'change-case';
import useThemePartsState from '../../hooks/settings/useThemePartsState';
import styled from 'styled-components';

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
                    <span className="flex-grow-1">{name}</span>
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

export default function SettingsMenu() {
    const [theme, setTheme] = useThemeState();
    const [themeParts, setThemeParts] = useThemePartsState();
    const [autosave, setAutosave] = useAdvancedPropsState();
    const [learningMode, setLearningMode] = useLearningModeState();
    // const [advanced, setAdvanced] = useAdvancedPropsState();

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
        // }, {
        //     name: 'Advanced Mode',
        //     description: 'Displays additional properties for complex use cases.',
        //     type: 'toggle',
        //     props: {
        //         value: advanced,
        //         onChange() {
        //             setAdvanced(!advanced);
        //         },
        //     },
    }];

    return (
        <div className="p-3">
            <h3>Settings</h3>
            {settings.map((setting, i) => (
                <div key={i}>
                    <hr/>
                    <Setting {...setting}/>
                </div>
            ))}
        </div>
    );
}