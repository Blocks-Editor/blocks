import {useEffect} from 'react';

export default function useTimeout(...args) {

    useEffect(() => {
        let id = setTimeout(...args);
        return () => clearTimeout(id);
    });
}
