import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/all';


export default function MenuNode({component, icon, ...others}) {
    return (
        <MenuAction {...others} icon={icon || <FaRegStickyNote/>}>
            {component.block?.title || component.name}
        </MenuAction>
    );
}