import { useEffect } from 'react';
import { useAsyncStorage } from "./UseAsyncStorage";
import { useUser } from './UseUser';
import { User } from '../../Types/User';

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

export const useAuth = () => {
    const { user, setUser, addUser, removeUser } = useUser();
    const { getItem } = useAsyncStorage();

    useEffect(() => {
        const getToken = async () => {
            let token = await getItem("@Nika:_token");

            if (token) {
                try {
                    const decoded = atob(token.split('.')[1]);
                    const cleanDecoded = decoded.replace(/\0/g, '');

                    addUser(JSON.parse(cleanDecoded), token);
                } catch (error) {
                    console.log(error)
                }

            }
        }

        getToken();
    }, []);

    const login = (token: string) => {
        const decoded = atob(token.split('.')[1]);
        const cleanDecoded = decoded.replace(/\0/g, '');

        addUser(JSON.parse(cleanDecoded), token);
    }

    const logout = () => {
        removeUser();
    };

    return { user, setUser, login, logout };
}