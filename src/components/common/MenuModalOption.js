import React from 'react';
import classNames from 'classnames';
import styled, {css} from 'styled-components';


const Container = styled.div`
    ${props => props.selected && css`
        //border: 1px solid #222;
    `}
    :hover {
        background: #0001;
    }
`;

export default function MenuModalOption({name, description, selected, className, children, ...others}) {
    return (
        <Container
            selected={selected}
            className={classNames(className, 'clickable d-flex mt-2 px-3 py-2', selected && 'text-primary')} {...others}>
            <div className="flex-grow-1">
                {name && <h4 className="fw-normal">{name}</h4>}
                {description && <div className="text-muted">{description}</div>}
            </div>
            <div>
                {children}
            </div>
        </Container>
    );
}