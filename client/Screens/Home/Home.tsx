import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native'; 
import { AuthContext } from '../../Contexts/Auth';
import useFetch from '../../Hooks/UseFetch';
import { SERVER_ORIGIN_IP, PORT_API } from '@env';
import CardsView from '../../Components/CardsView/CardsView';
import { Conversation } from '../../Types/Conversation';

interface props {
    navigation: any
}

function Home({ navigation }: props) {
    const { authState } = useContext(AuthContext);
    const [fetchAPI, loading] = useFetch();
    const [conversations, setConversations] = useState<Array<Conversation>>([]);

    const getConversations = async () => {
        await fetchAPI({
            url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/conversations`,
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data.data)) {
                setConversations(data.data);
            }
        });
    }

    useEffect(() => {
        if(!authState.isAuthenticated) navigation.navigate('Login');

        getConversations();

    }, [authState]);

    return(
        <View>
            {
                conversations.length === 0
                ? <Text>Aucun messages, vous n'avez pas d'amis.</Text>
                : <CardsView data={conversations} />
            }
        </View>
    )
}

export default Home;