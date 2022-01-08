import {initializeApp} from 'firebase/app';
import {getAnalytics, isSupported} from 'firebase/analytics';
import {getFirestore} from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: 'AIzaSyB2Knl_5Z113bHF4ncVwf37qENayLs-TUY',
    authDomain: 'motoko-blocks.firebaseapp.com',
    projectId: 'motoko-blocks',
    storageBucket: 'motoko-blocks.appspot.com',
    messagingSenderId: '225162830482',
    appId: '1:225162830482:web:5f4a0c292cd509bc6c3c4b',
    measurementId: 'G-2V5DTR90FF',
};

export const app = initializeApp(firebaseConfig);
export const analyticsPromise = isSupported().then(supported => supported ? getAnalytics(app) : null);
export const db = getFirestore(app);
