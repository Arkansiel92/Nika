import { useState, useEffect, useContext } from 'react';
import { AuthState } from "../Types/AuthState";
import { useAsyncStorage } from '../Hooks/UseAsyncStorage';
import { AuthContext } from '../Contexts/Auth';
import { socketContext } from '../Contexts/Socket';

function atob(input: string) {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    var output = ''
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    do {
        enc1 = keyStr.indexOf(input.charAt(i++))
        enc2 = keyStr.indexOf(input.charAt(i++))
        enc3 = keyStr.indexOf(input.charAt(i++))
        enc4 = keyStr.indexOf(input.charAt(i++))
        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
        chr3 = ((enc3 & 3) << 6) | enc4
        output = output + String.fromCharCode(chr1)
        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2)
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3)
        }
    } while (i < input.length)
    return output
}

const initialAuthState: AuthState = {
    user: null,
    isAuthenticated: false,
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<AuthState>(initialAuthState);
    const { setItem, getItem, removeItem } = useAsyncStorage();
    const socket = useContext(socketContext);

    useEffect(() => {
        const getToken = async () => {
            const token = await getItem("@Nika:_token");
            
            if(token) login(token);
        }

        getToken();
    }, []);

    const decodeJWT = (token: string) => {
        let decoded = atob(token.split('.')[1]);
        let cleanDecoded = decoded.replace(/\0/g, '');

        return cleanDecoded;
    }

    const login = async (token: string) => {
        try {
            await setItem("@Nika:_token", token);
    
            let decoded = decodeJWT(token);
            let user = JSON.parse(decoded);

            setAuthState({ user: user, isAuthenticated: true });
            socket.emit('login', user);

            // console.log(user);
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {
        await removeItem("@Nika:_token");
        setAuthState({ user: null, isAuthenticated: false });
        socket.emit('login', null);
    }
    
    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}
