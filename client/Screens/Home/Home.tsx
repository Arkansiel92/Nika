import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native'; 
import { AuthContext } from '../../Services/Contexts/Auth/Auth';
import useFetch from '../../Services/Hooks/UseFetch';
import { SERVER_ORIGIN_IP, PORT_API } from '@env';

interface props {
    navigation: any
}

function Home({ navigation }: props) {
    const { authState } = useContext(AuthContext);
    const [fetchAPI, loading] = useFetch();
    const [messages, setMessages] = useState([]);

    const getMessages = async () => {
        await fetchAPI({
            url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/messages`,
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); 
            setMessages(data);
        });
    }

    useEffect(() => {
        if(!authState.isAuthenticated) navigation.navigate('Login');

        getMessages();

    }, [authState]);

    return(
        <View>
            <Text>Connecté en tant que { authState.user?.username } !</Text>
            {
                messages.length === 0
                ? <Text>Aucun messages, vous n'avez pas d'amis.</Text>
                : <Text>Vous avez {messages.length} messages.</Text>
            }
        </View>
    )
}

export default Home;