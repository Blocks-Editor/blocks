import {useEffect} from 'react';

export default function useInterval(...args) {
    useEffect(() => {
        const id = setInterval(...args);
        return () => clearInterval(id);
    });
}
