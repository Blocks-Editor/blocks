import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {IconContext} from 'react-icons';

let MenuContainer = styled.div`

  .menu-item {

  }
`;

export default function TopMenu({className, children, ...others}) {
    return (
        <MenuContainer className={classNames('top-menu bg-light d-flex', className)} {...others}>
            <IconContext.Provider value={{style: {verticalAlign: 'bottom', transform: 'translateY(-1px)'}}}>
                {children}
            </IconContext.Provider>
        </MenuContainer>
    );
}