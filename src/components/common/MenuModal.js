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
                {title && <h3 className="fw-light mb-0">{title}</h3>}
                <FiX size={18} className="mx-2 clickable" onClick={() => {setOpenMenu(null)}} />
            </TitleContainer>
            <hr/>
            {children}
        </div>
    );
}