import React from "react";

import {ReactComponent as Download} from "../../icons/download.svg";
import {ReactComponent as FilePlus} from "../../icons/file-plus.svg";
import {ReactComponent as Folder} from "../../icons/folder.svg";
import {ReactComponent as FolderWide} from "../../icons/folder-wide.svg";
import {ReactComponent as FolderOpen} from "../../icons/folder-open.svg";
import {ReactComponent as Save} from "../../icons/save.svg";

const DEFAULT_ICON_HEIGHT = 24;
const DEFAULT_FILL = "rgb(108, 117, 125)"

// This isn't super useful yet, but I think we could add some nice stuff with an Icon component.
// If you disagree, feel free to get rid of it.

export default function Icon(props) {
    const options = {
        ...props,
        fill: props.fill || DEFAULT_FILL,
        height: props.height || DEFAULT_ICON_HEIGHT,
        width: props.name === "folder-wide" || props.name === "folder-open" ?
            (30/24) * (props.height || DEFAULT_ICON_HEIGHT) : (props.height || DEFAULT_ICON_HEIGHT)
    }

    // If you know some magic to make this less bad, feel free to do it
    switch(props.name) {
        case "download":
            return <Download {...options} />
        case "file-plus":
            return <FilePlus {...options} />
        case "folder":
            return <Folder {...options} />
        case "folder-wide":
            return <FolderWide {...options} />
        case "folder-open":
            return <FolderOpen {...options} />
        case "save":
            return <Save {...options} />
        default:
            return <Save {...options} />
    }
}