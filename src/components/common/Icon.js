import React from 'react';
import {ReactComponent as Download} from '../../assets/icons/download.svg';
import {ReactComponent as FilePlus} from '../../assets/icons/file-plus.svg';
import {ReactComponent as Folder} from '../../assets/icons/folder.svg';
import {ReactComponent as FolderWide} from '../../assets/icons/folder-wide.svg';
import {ReactComponent as FolderOpen} from '../../assets/icons/folder-open.svg';
import {ReactComponent as Save} from '../../assets/icons/save.svg';
import {ReactComponent as Crosshair} from '../../assets/icons/crosshair.svg';
import {ReactComponent as Learning} from '../../assets/icons/learning.svg';
import {ReactComponent as Settings} from '../../assets/icons/settings.svg';
import {ReactComponent as Share} from '../../assets/icons/share.svg';
import {ReactComponent as Menu} from '../../assets/icons/menu.svg';


const defaultIconSize = 24;
const defaultFill = '#557080';

const createIcon = (SvgComponent, widthRatio = 1) => ({fill, size, ...others}) => {
    return (
        <SvgComponent
            fill={fill || defaultFill}
            width={(size || defaultIconSize) * widthRatio}
            height={size || defaultIconSize}
            {...others}
        />
    );
};

export const DownloadIcon = createIcon(Download);
export const FilePlusIcon = createIcon(FilePlus);
export const FolderIcon = createIcon(Folder);
export const FolderWideIcon = createIcon(FolderWide, 30 / 24); // TODO: we can probably automate this
export const FolderOpenIcon = createIcon(FolderOpen, 30 / 24);
export const SaveIcon = createIcon(Save);
export const CrosshairIcon = createIcon(Crosshair);
export const LearningIcon = createIcon(Learning);
export const SettingsIcon = createIcon(Settings);
export const SocialIcon = createIcon(Share);
export const MenuIcon = createIcon(Menu);