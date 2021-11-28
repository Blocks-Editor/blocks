import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {IconContext} from 'react-icons';
import {ReactComponent as Gradient} from '../../../assets/icons/gradient.svg';

let MenuContainer = styled.div`
    background: #FFF;
    margin-bottom: 3px;
    position: relative;
    background-clip: padding-box;
    z-index: 10;
  
    :before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, #00EFFB, #8649E1, #F900E3);
        z-index: -1;
        margin-bottom: -3px;
    }
    
`;

let StyledGradient = styled(Gradient)`
  height: 0;
  width: 0;
`;

export default function TopMenu({className, children, ...others}) {
    return (
        <MenuContainer className={classNames('top-menu text-secondary d-flex py-2 justify-content-start align-items-center', className)} {...others}>
            <StyledGradient/>
            <IconContext.Provider value={{style: {verticalAlign: 'bottom', transform: 'translateY(-1px)'}}}>
                {children}
            </IconContext.Provider>
        </MenuContainer>
    );
}