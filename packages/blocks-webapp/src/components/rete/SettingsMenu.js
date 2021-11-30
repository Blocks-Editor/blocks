import React from 'react';

import useDetailedTooltipsState from '../../hooks/settings/useDetailedTooltipsState';
import useThemeState from '../../hooks/settings/useThemeState';

/**
 * Creates an input based on the provided type.
 */
function SettingInput({type, ...others}) {
    let value;
    switch(type) {
        case "select":
            let options = others.options;
            let onChange = others.onChange;
            value = others.value;

            return (
                <select className="form-control ml-5 w-auto" onChange={onChange} value={value}>
                    {options.map((option, i) => (
                        <option value={option} key={i}>{option}</option>
                        )
                    )}
                </select>
            )

        case "toggle":
            value = others.value;
            let onClick = others.onClick;
            return (
                <input type="checkbox" value={value} onClick={onClick} />
            )

        default:
            return (
                <div />
            )
    }
}

/**
 * Creates a UI element for a given setting.
 */
function Setting({name, description, type, ...others}) {

    return (
        <div className="w-100 py-2 px-3 d-flex flex-column align-items-start justify-content-center">
            <div className="w-100 d-flex flex-row align-items-center justify-content-between">
                <span className="flex-grow-1">{name}</span>
                <SettingInput type={type} {...others} />
            </div>
            <span className="small text-muted">{description}</span>
        </div>
    )
}

export default function SettingsMenu() {
    const [learningMode, setLearningMode] = useDetailedTooltipsState();
    const [theme, setTheme] = useThemeState();

    // Define the content for each option.
    const settings = [
        {
            "name": "Theme",
            "description": "The color scheme used in the editor.",
            "type": "select",
            "value": theme,
            "options": ["dark", "light", "lightdark"],
            "onChange": (e) => {setTheme(e.target.value)}
        },
        {
            "name": "Learning Mode",
            "description": "Provides more detailed tooltips.",
            "type": "toggle",
            "value": learningMode,
            "onClick": () => { setLearningMode(!learningMode) }
        }
    ]

    return (
        <div className="p-3">
            <h3>Settings</h3>
            {settings.map((setting, i) => (
                <Setting
                    key={i}
                    {...setting}
                />
            ))}
        </div>
    )
}