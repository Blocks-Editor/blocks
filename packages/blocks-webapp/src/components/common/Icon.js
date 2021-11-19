import React from 'react';
import {ReactComponent as Download} from '../../assets/icons/download.svg';
import {ReactComponent as FilePlus} from '../../assets/icons/file-plus.svg';
import {ReactComponent as Folder} from '../../assets/icons/folder.svg';
import {ReactComponent as FolderWide} from '../../assets/icons/folder-wide.svg';
import {ReactComponent as FolderOpen} from '../../assets/icons/folder-open.svg';
import {ReactComponent as Save} from '../../assets/icons/save.svg';
// import {ReactComponent as Zoom} from '../../assets/icons/zoom.svg';

// Convention here is `CONSTANT_CASE` for exported constants and `camelCase` otherwise.
// This makes it easier to quickly know what values are globally accessible, since almost everything is a constant anyway.

const defaultIconSize = 24;
const defaultFill = 'rgb(108, 117, 125)';

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
// export const ZoomIcon = createIcon(Zoom);///
