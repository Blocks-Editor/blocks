import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {FiX} from 'react-icons/fi';
import useEditorMenuState from '../../hooks/persistent/useEditorMenuState';
import {onLeftClick} from '../../utils/eventHelpers';

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
            {title && (
                <>
                    <TitleContainer>
                        <h3 className="fw-light mb-0">{title}</h3>
                        <div
                            className="clickable p-2 mb-1"
                            {...onLeftClick(() => setOpenMenu(null))}>
                            <FiX size={18}/>
                        </div>
                    </TitleContainer>
                    <hr/>
                </>
            )}
            {children}
        </div>
    );
}