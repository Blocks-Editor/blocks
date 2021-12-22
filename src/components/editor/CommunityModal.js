import React from 'react';
import MenuModal from '../common/MenuModal';
import {SocialIcon} from 'react-social-icons';
import styled from 'styled-components';

const socials = [
    ['GitHub', 'https://github.com/Blocks-Editor/blocks'],
    ['Discord', 'https://discord.gg/jDDWtKwWQf'],
    ['Twitter', 'https://twitter.com/BlocksEditor'],
    ['Instagram', 'https://www.instagram.com/blocks_editor/'],
    ['Facebook', 'https://www.facebook.com/BlocksEditor'],
    ['LinkedIn', 'https://www.linkedin.com/showcase/blocks-editor'],
    ['Telegram', 'https://t.me/BlocksEditor'],
];

// function SocialButton({href, icon, ...others}) {
//     return (
//         <a href={href} className="btn btn-lg rounded-circle" {...others}>
//             {icon}
//         </a>
//     );
// }

// noinspection CssRedundantUnit (IE compatibility)
const SocialContainer = styled.div`
    //flex: 1 1 0px;
    //width: 0;
    font-size: 11px;
    font-weight: 500;
`;

export default function CommunityModal() {

    return (
        <MenuModal title="Community">
            <div className="text-center d-flex flex-wrap justify-content-start">
                {socials.map(([label, url]) => (
                    <SocialContainer key={url} className="mx-4 my-3">
                        <SocialIcon url={url} target="_blank" rel="noreferrer"/>
                        <div className="mt-2 opacity-75 noselect">{label}</div>
                    </SocialContainer>
                ))}
            </div>
        </MenuModal>
    );
}