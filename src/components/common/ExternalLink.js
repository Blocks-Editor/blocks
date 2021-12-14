import React from 'react';

export default function ExternalLink({href, children, ...others}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{textDecoration: 'none'}}
            {...others}>
            {children}
        </a>
    );
}