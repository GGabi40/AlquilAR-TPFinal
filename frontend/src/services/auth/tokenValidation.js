import {jwtDecode} from 'jwt-decode';

export const isTokenValid = (token) => {
    if(!token) return false;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return currentTime < decodedToken.exp;
    } catch (error) {
        console.error('Error decodificando token: ', error);
        return false;
    }
};