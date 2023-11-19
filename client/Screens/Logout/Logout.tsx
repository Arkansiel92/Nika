import { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { AuthContext } from '../../Contexts/Auth';

interface props {
    navigation: any
}

function Logout({ navigation }: props) {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
    })

    return (
        <View></View>
    );
}

export default Logout;