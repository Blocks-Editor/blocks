import {useState} from 'react';

export default function useRedraw() {

    let redraw = useState({})[1];

    return () => redraw({});
}
