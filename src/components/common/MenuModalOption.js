import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';


const Container = styled.div`
    :hover {
        background: #0001;
    }
`;

export default function MenuModalOption({name, description, className, children, ...others}) {
    return (
        <Container
            className={classNames(className, 'clickable d-flex mt-2 px-3 py-2')} {...others}>
            <div className="flex-grow-1">
                {name && <h4 className="mb-0 fw-normal">{name}</h4>}
                {description && <div className="text-secondary">{description}</div>}
            </div>
            <div>
                {children}
            </div>
        </Container>
    );
}