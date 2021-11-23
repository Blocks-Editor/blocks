import {useState} from 'react';

export default function useRedraw() {
    const redraw = useState({})[1];
    return () => redraw({});
}
