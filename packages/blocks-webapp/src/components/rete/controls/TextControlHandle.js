import React from 'react';
import useControlState from '../../../hooks/useControlState';
import classNames from 'classnames';


export default function TextControlHandle({control, bindInput, validation: {minLength, maxLength}}) {
    let [value, setValue] = useControlState(control);

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
            onChange={event => setValue(event.target.value || (control.config.optional && minLength > 0 ? undefined : ''))}
        />
    );
}