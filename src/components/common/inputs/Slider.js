import classNames from 'classnames';
import {useCallback, useState} from 'react';

export default function Slider(
    {
        min = 0,
        max = 1,
        step = 1,
        width,
        value,
        onChange,
        formatValue,
        className,
        children,
        ...rest
    },
) {
    const [current, setCurrent] = useState(null);

    const handleChange = useCallback(event => {
        setCurrent(+event.target.value);
    }, []);

    const handleMouseUp = useCallback(() => {
        onChange(current ?? value);
        setCurrent(null);
    }, [current, value, onChange]);

    return (
        <label className={classNames('noselect d-flex justify-content-between', className)} {...rest}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                style={{width}}
                value={current ?? value ?? (min + max) / 2}
                onChange={handleChange}
                onMouseUp={handleMouseUp}
            />
            <span
                className="ms-2 opacity-75 align-text-bottom text-nowrap"
                style={{width: '2rem'}}>
                {formatValue ? formatValue(value) : value}
            </span>
            {children && <span className="ms-2 align-text-bottom text-muted flex-grow-1">{children}</span>}
        </label>
    );
}