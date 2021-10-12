import MenuAction from './MenuAction';
import {FaRegStickyNote} from 'react-icons/all';


export default function MenuNode(props) {
    let {component, icon, ...others} = props;

    return (
        <MenuAction {...others} icon={icon || <FaRegStickyNote/>}>
            {component.block?.title || component.name}
        </MenuAction>
    );
}