import { useContext } from 'react';
import { useAsyncStorage } from './UseAsyncStorage';
import { User } from '../../Types/User';
import { AuthContext } from '../Contexts/Auth/Auth';

export const useUser = () => {
    const { user, setUser } = useContext(AuthContext);
    const { setItem, removeItem } = useAsyncStorage();

    const addUser = (user: User, token: string) => {
        setUser(user);
        setItem("@Nika:_token", token);
    }

    const removeUser = () => {
        setUser(null);
        removeItem("@Nika:_token");
    }

    return { user, setUser,  addUser, removeUser };
}