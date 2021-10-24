import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/all';


export default function MenuNode({component, ...others}) {
    let category = component.block?.category;
    return (
        <MenuAction {...others} icon={category?.icon || <FaRegStickyNote/>} color={category?.color}>
            {component.block?.title || component.name}
        </MenuAction>
    );
}