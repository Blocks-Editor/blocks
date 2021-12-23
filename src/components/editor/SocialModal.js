import React, {useState} from 'react';
import MenuModal from '../common/MenuModal';
import {SocialIcon} from 'react-social-icons';
import styled from 'styled-components';
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/Component';
import {FiClipboard} from 'react-icons/fi';
import classNames from 'classnames';
import {logTelemetry} from '../../telemetry';

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

const wallets = [
    ['ICP', '88e2a3d64a2bc737f5beb41bf6d4f03e8836caf6ba2ce851e4db4faa9e0193a7'],
    // ['ETH', ''],
    // ['BTC', ''],
    ['USDC', '0x49644cc150e780E3C9767068cEA1319Aed64D43e'],
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
    const [copied, setCopied] = useState(null);

    return (
        <MenuModal title="Join our Community:" onClick={() => setCopied(null)}>
            <div className="text-center d-flex flex-wrap justify-content-between">
                {socials.map(([label, url]) => (
                    <SocialContainer key={url} className="mx-3 my-3">
                        <StyledSocialIcon url={url} target="_blank" rel="noreferrer"/>
                        <div className="mt-2 opacity-75 noselect">{label}</div>
                    </SocialContainer>
                ))}
            </div>
            <hr/>
            <h4 className="mt-4 mb-3 fw-normal">Support the Project!</h4>
            <div>
                {wallets.map(([label, address]) => {
                    let inputElement;
                    const handleSelect = () => {
                        logTelemetry('donation_select', {
                            interaction: label,
                        });
                        inputElement?.select();
                    };
                    return (
                        <div key={label + address} className="d-flex align-items-center my-2">
                            <div className="text-end me-3" style={{width: '6rem', fontWeight: 500}}>
                                {label}
                            </div>
                            <input
                                ref={el => inputElement = el}
                                type="text"
                                className="form-control form-control-sm w-100 small"
                                readOnly
                                value={address}
                                onFocus={handleSelect}
                            />
                            <CopyToClipboard
                                text={address}
                                onCopy={() => {
                                    setCopied(address);
                                    handleSelect();
                                }}>
                                <div
                                    className="clickable h5 text-secondary ps-2 pb-1 m-0 d-flex"
                                    onClick={event => event.stopPropagation()}>
                                    <FiClipboard className={classNames(copied === address && 'text-primary')}/>
                                </div>
                            </CopyToClipboard>
                        </div>
                    );
                })}
            </div>
        </MenuModal>
    );
}