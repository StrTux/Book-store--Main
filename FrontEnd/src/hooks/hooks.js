import { useState } from 'react';
import { useAuth } from './useAuth';
import { useFetch } from './useFetch';

function useAuthLogin() {
    const { login } = useAuth();
    return login;
}

function useAuthLogout() {
    const { logout } = useAuth();
    return logout;
}

function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue(v => !v); 
    return [value, toggle];
}

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value)); // Fixed typo here (JSON.stringify instead of JSON.stringsify)
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

export { useAuthLogin, useAuthLogout, useToggle, useLocalStorage, useFetch };
