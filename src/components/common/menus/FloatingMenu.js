import React from 'react';
import styled, {css} from 'styled-components';
import classNames from 'classnames';
import {isMobile} from 'react-device-detect';

let ContainerDiv = styled.div`
    position: absolute;

    ${props => props.bottom && css`
        bottom: 0;
    `};

    ${props => props.top && css`
        top: 0;
        margin-top: ${isMobile ? 125 : 75}px;
    `};

    ${props => props.left && css`
        left: 0;
    `};

    ${props => props.right && css`
        right: 0;
    `};

    z-index: 100;
`;

export default function FloatingMenu({className, children, ...others}) {
    return (
        <ContainerDiv className={classNames('floating-menu p-4 d-flex flex-row align-items-center justify-content-center', className)} {...others}>
            {children}
        </ContainerDiv>
    );
}