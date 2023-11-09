import { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import useFetch from "../../Services/Hooks/UseFetch";
import { PORT_API, SERVER_ORIGIN_IP } from "@env";
import { AuthContext } from "../../Services/Contexts/Auth/Auth";
import { Message } from "../../Types/Message";

interface props {
    route: any
    navigation: any
}

function Conversation({ route, navigation }: props) {
    const [fetchAPI, loading] = useFetch();
    const [messages, setMessage] = useState<Array<Message>>([]);
    const { targetId } = route.params;
    const { authState } = useContext(AuthContext);

    const getConversation = async () => {
        await fetchAPI({
            url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/messages/${targetId}`,
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                setMessage(data.data);
            }
        });
    }

    useEffect(() => {
        if(!authState.isAuthenticated) navigation.navigate('Login');

        getConversation();
    }, []);

    return (
        <View style={styles.container}>
            {
                messages.map((message, index: number) => (
                    <View key={index} style={ message.sender_id === authState.user?.id ? styles.userMessage : styles.targetMessage }>
                        <Text>{message.content}</Text>
                    </View>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    userMessage: {
        padding: 10,
        margin: 12,
        marginLeft: "auto",
        borderRadius: 16,
        backgroundColor: '#557bf3',
        color: '#d9e1fc'
    },
    targetMessage: {
        padding: 10,
        margin: 12,
        marginRight: 'auto',
        borderRadius: 16,
        backgroundColor: '#f6f8fd',
        color: '#666e83'
    },
})

export default Conversation;