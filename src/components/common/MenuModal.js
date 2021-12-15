import React from 'react';
import classNames from 'classnames';

export default function MenuModal({title, className, children, ...others}) {

    return (
        <div className={classNames('p-3', className)} {...others}>
            {title && <h3 className="fw-light">{title}</h3>}
            <hr/>
            {children}
        </div>
    );
}