import React from 'react';
import useThemeState from '../../hooks/settings/useThemeState';
import useThemes from '../../hooks/useThemes';
import useAdvancedPropsState from '../../hooks/settings/useAdvancedPropsState';

const settingInputs = {
    select({value, options, onChange}) {
        return (
            <select className="form-control ml-5 w-auto" onChange={onChange} value={value}>
                {options.map((option, i) => (
                        <option value={option.value} key={i}>{option.label ?? option.value}</option>
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

/**
 * Creates a UI element for a given setting.
 */
function Setting({name, description, type, props}) {

    const SettingInput = settingInputs[type];

    return (
        <div className="w-100 py-2 px-3 d-flex flex-column align-items-start justify-content-center">
            <div className="w-100 d-flex flex-row align-items-center justify-content-between">
                <span className="flex-grow-1">{name}</span>
                {SettingInput && <SettingInput {...props}/>}
            </div>
            <span className="small text-muted">{description}</span>
        </div>
    );
}

export default function SettingsMenu() {
    const [theme, setTheme] = useThemeState();
    const [autosave, setAutosave] = useAdvancedPropsState();
    // const [learningMode, setLearningMode] = useLearningModeState();
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
    }, {
        name: 'Auto-Save Changes',
        description: 'Automatically sync changes while using the editor.',
        type: 'toggle',
        props: {
            value: autosave,
            onChange() {
                setAutosave(!autosave);
            },
        },
    }, {
        // }, {
        //     name: 'Detailed Tooltips',
        //     description: 'Provides more detailed tooltips.',
        //     type: 'toggle',
        //     props: {
        //         value: learningMode,
        //         onChange() {
        //             setLearningMode(!learningMode);
        //         },
        //     },
        // },{
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
                <Setting key={i}  {...setting}/>
            ))}
        </div>
    );
}