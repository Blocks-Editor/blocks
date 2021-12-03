import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

let ContainerDiv = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 100;
`;

export default function FloatingMenu({className, children, ...others}) {
    return (
        <ContainerDiv className={classNames('p-5 d-flex flex-row align-items-center justify-content-center', className)} {...others}>
            {children}
        </ContainerDiv>
    );
}