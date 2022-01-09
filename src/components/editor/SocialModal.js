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
    ['Twitter', 'https://twitter.com/BlocksEditor'],
    ['Discord', 'https://discord.gg/jDDWtKwWQf'],
    // ...(isMobile ? [
    // ['Instagram', 'https://www.instagram.com/blocks_editor'],
    // ] : []),
    // ['Facebook', 'https://www.facebook.com/BlocksEditor'],
    // ['Reddit', 'https://www.reddit.com/r/BlocksEditor'],
    // ['LinkedIn', 'https://www.linkedin.com/showcase/blocks-editor'],
    // ['Telegram', 'https://t.me/BlocksEditor'],
    // ['YouTube', 'https://www.youtube.com/channel/UCuk-YEcSQ6-dYN-2Kvcvt-w'],
    ['Medium', 'https://blocks-editor.medium.com'],
];

const wallets = [
    ['ICP', '184d1794cba6d6384e8487c702436eee7614aeb17cbfc94fcfa328b3f7bf7f75'],
    ['ETH', '0xE977fa3a79fC45eB7c2C628d7D7De65483Cd0751'],
    ['BTC', '3QpW3YxLBEvBpNn8PP53kvHXRktvKafu4w'],
    ['USDT', '0x5274c12Fe17E00276D2cd1FB0aeb5eb9868E006f'],
    ['USDC', '0x0b00230c684cCf1220bDD82970240F5e5E9b3f1C'],
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
                        <StyledSocialIcon
                            url={url} target="_blank" rel="noreferrer" onClick={() => {
                            logTelemetry('social_visit', {
                                interaction: label,
                            });
                        }}/>
                        <div className="mt-2 opacity-75 noselect">{label}</div>
                    </SocialContainer>
                ))}
            </div>
            <hr/>
            <h4 className="mt-4 mb-3 fw-normal">Support the Project!</h4>
            <div>
                <p className="text-secondary">
                    Blocks is a 100% open-source IC community project.
                    Please donate to help keep the application running.
                </p>
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
                            <div className="text-end me-3" style={{width: '4rem', fontWeight: 500}}>
                                {label}
                            </div>
                            <input
                                ref={el => inputElement = el}
                                type="text"
                                className="form-control form-control-sm font-monospace w-100 small"
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
                                    onClick={event => event.stopPropagation()}
                                    title="Copy wallet address">
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