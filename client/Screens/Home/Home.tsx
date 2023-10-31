import { useContext, useEffect } from 'react';
import { View, Text } from 'react-native'; 
import { AuthContext } from '../../Services/Contexts/Auth/Auth';

interface props {
    navigation: any
}

function Home({ navigation }: props) {
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        if(!authState.isAuthenticated) navigation.navigate('Login');

    }, [authState]);

    return(
        <View>
            <Text>Home screen</Text>
            <Text>Connecté en tant que { authState.user?.username } !</Text>
        </View>
    )
}

export default Home;