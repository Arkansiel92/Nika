import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native'; 
import { AuthContext } from '../../Services/Contexts/Auth/Auth';
import useFetch from '../../Services/Hooks/UseFetch';
import { SERVER_ORIGIN_IP, PORT_API } from '@env';
import Card from '../../Components/Card/Card';

interface props {
    navigation: any
}

function Home({ navigation }: props) {
    const { authState } = useContext(AuthContext);
    const [fetchAPI, loading] = useFetch();
    const [conversations, setConversations] = useState<Array<any>>([]);

    const getConversations = async () => {
        await fetchAPI({
            url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/conversations`,
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); 
            if(Array.isArray(data)) {
                setConversations(data);
            }
        });
    }

    useEffect(() => {
        if(!authState.isAuthenticated) navigation.navigate('Login');

        getConversations();

    }, [authState]);

    return(
        <View>
            <Text>Connecté en tant que { authState.user?.username } !</Text>
            {
                conversations.length
                ? <Text>Aucun messages, vous n'avez pas d'amis.</Text>
                : <View>
                    {conversations.map((c: any) => (
                        <Card />
                    ))}
                </View>
            }
        </View>
    )
}

export default Home;