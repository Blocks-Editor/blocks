import React from 'react';
import MenuModal from '../common/MenuModal';
import {SocialIcon} from 'react-social-icons';
import styled from 'styled-components';

const socials = [
    ['GitHub', 'https://github.com/Blocks-Editor/blocks'],
    ['Discord', 'https://discord.gg/jDDWtKwWQf'],
    ['Twitter', 'https://twitter.com/BlocksEditor'],
    ['Instagram', 'https://www.instagram.com/blocks_editor'],
    ['Facebook', 'https://www.facebook.com/BlocksEditor'],
    ['LinkedIn', 'https://www.linkedin.com/showcase/blocks-editor'],
    ['Telegram', 'https://t.me/BlocksEditor'],
    ['Reddit', 'https://www.reddit.com/r/BlocksEditor'],
    ['YouTube', 'https://www.youtube.com/channel/UCuk-YEcSQ6-dYN-2Kvcvt-w'],
    ['Medium', 'https://medium.com/@BlocksEditor'],
];

// noinspection CssRedundantUnit (IE compatibility)
const SocialContainer = styled.div`
    flex: 1 1 0px;
    //width: 0;
    font-size: 11px;
    font-weight: 500;
`;

const StyledSocialIcon = styled(SocialIcon)`
    transition: transform .1s ease-out;

    // Funky edge rendering due to slightly different radii
    //border-radius: 50%;
    //box-shadow: 0 2px 8px #000A;

    &:hover {
        transform: scale(1.1);
        transition: transform .05s ease-out;
        //box-shadow: 0 4px 12px #000A;
    }
`;

export default function SocialModal() {

    return (
        <MenuModal title="Join our Community:">
            <div className="text-center d-flex flex-wrap justify-content-between">
                {socials.map(([label, url]) => (
                    <SocialContainer key={url} className="mx-3 my-3">
                        <StyledSocialIcon url={url} target="_blank" rel="noreferrer"/>
                        <div className="mt-2 opacity-75 noselect">{label}</div>
                    </SocialContainer>
                ))}
            </div>
        </MenuModal>
    );
}