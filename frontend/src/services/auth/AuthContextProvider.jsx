import React, { useEffect, useState } from 'react';
import { AuthenticationContext } from '../auth.context';

import { jwtDecode } from 'jwt-decode';

const tokenValue = localStorage.getItem('alq-token');

const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(tokenValue);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if(token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
            setRole(decoded.role);
        }
    }, [token]);

    const handleUserLogin = (token) => {
        localStorage.setItem('alq-token', token);
        setToken(token);
        setUserId(null);
    }

    const handleUserLogout = () => {
        localStorage.removeItem('alq-token');
        setToken(null);
        setUserId(null);
    }

  return (
    <AuthenticationContext.Provider
        value={{ token, userId, role, handleUserLogin, handleUserLogout }}
    >
        {children}
    </AuthenticationContext.Provider>
  )
}

export default AuthContextProvider;