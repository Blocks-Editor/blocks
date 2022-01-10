import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {FiX} from 'react-icons/fi';
import useEditorMenuState from '../../hooks/persistent/useEditorMenuState';

const TitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export default function MenuModal({title, className, children, ...others}) {
    const [, setOpenMenu] = useEditorMenuState();

    return (
        <div className={classNames('p-3', className)} {...others}>
            <TitleContainer>
                {title && <h3 className="fw-light">{title}</h3>}
                <div className="clickable p-2" onClick={() => {setOpenMenu(null)}}>
                    <FiX size={18}  />
                </div>
            </TitleContainer>
            <hr/>
            {children}
        </div>
    );
}