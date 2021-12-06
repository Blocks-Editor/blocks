import {useEffect} from 'react';

export default function useTimeout(...args) {
    useEffect(() => {
        const id = setTimeout(...args);
        return () => clearTimeout(id);
    });
}
