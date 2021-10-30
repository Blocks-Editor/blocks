import {useEffect} from 'react';

export default function useInterval(...args) {

    useEffect(() => {
        let id = setInterval(...args);
        return () => clearInterval(id);
    });
}
