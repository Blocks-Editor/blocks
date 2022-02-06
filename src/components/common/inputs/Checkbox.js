import classNames from 'classnames';
import {useCallback} from 'react';

export default function Checkbox({value, onChange, className, children, ...rest}) {
    const handleChange = useCallback(event => {
        onChange(event.target.checked);
    }, [onChange]);

    return (
        <label className={classNames('noselect', className)} {...rest}>
            <input type="checkbox" checked={!!value} onChange={handleChange}/>
            {children && <span className="ms-2 align-text-bottom">{children}</span>}
        </label>
    );
}