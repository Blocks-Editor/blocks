import React from 'react';
import useControlValue from '../../../hooks/useControlValue';
import classNames from 'classnames';


export default function TextControlHandle({control, bindInput, validation: {minLength, maxLength}}) {
    let [value, setValue] = useControlValue(control);

    let invalid = !control.validate(value);

    return (
        <input
            type="text"
            className={classNames('w-100', invalid && 'invalid')}
            autoComplete="blocks-app"
            autoCorrect="off"
            ref={bindInput}
            value={value || ''}
            placeholder={control.name}
            minLength={minLength}
            maxLength={maxLength}
            onChange={event => setValue(event.target.value || undefined)}
        />
    );
}
