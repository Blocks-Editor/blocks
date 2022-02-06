import {useCallback} from 'react';
import classNames from 'classnames';

export default function TextInput({value, onChange, className, children, ...rest}) {
    const handleChange = useCallback(event => {
        onChange(event.target.value);
    }, [onChange]);

    return (
        <input
            type="text"
            className={classNames('form-control bg-dark text-light', className)}
            value={value || ''}
            onChange={handleChange}
            {...rest}
        />
    );
}