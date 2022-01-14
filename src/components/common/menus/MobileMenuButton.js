import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

let StyledMobileMenuItem = styled.div`
    background: #FFFFFF11;
    
    > svg {
        fill: url("#svg-block-gradient");
    }
`;

export default function MobileMenuButton({children, className, ...others}) {
    return (
        <StyledMobileMenuItem className={classNames('mobile-menu-button m-1 px-3 py-3 rounded clickable d-flex flex-row align-items-center justify-content-start', className)} {...others}>
            {children}
        </StyledMobileMenuItem>
    );
}