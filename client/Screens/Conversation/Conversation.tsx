import { useEffect, useContext, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import useFetch from "../../Services/Hooks/UseFetch";
import { PORT_API, SERVER_ORIGIN_IP } from "@env";
import { AuthContext } from "../../Services/Contexts/Auth/Auth";
import { Message } from "../../Types/Message";
import InputContainer from "../../Components/InputContainer/InputContainer";
import { User } from "../../Types/User";

interface props {
    route: any
    navigation: any
}

function Conversation({ route, navigation }: props) {
    const [fetchAPI, loading] = useFetch();
    const [messages, setMessage] = useState<Array<Message>>([]);
    const [target, setTarget] = useState<User | null>(null);
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
                setTarget(data.target);
                console.log(data.target);
            }
        });
    }

    useEffect(() => {
        if(!authState.isAuthenticated) navigation.navigate('Login');

        getConversation();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
            {
                messages.map((message, index: number) => (
                    <View key={index} style={styles.containerMessage}>
                        <Text style={ message.sender_id === authState.user?.id ? styles.userMessage : styles.targetMessage }>{message.content}</Text>
                        <Text style={ message.sender_id === authState.user?.id ? {marginLeft: 'auto', fontSize: 12} : {marginRight: 'auto', fontSize: 12} }>{ new Date(message.published_at).getHours() + ':' + new Date(message.published_at).getMinutes() }</Text>
                    </View>
                ))
            }
            </ScrollView>
            <InputContainer receiverId={target?.id} senderId={authState.user?.id} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff'
    },
    containerMessage: {
        margin: 12,
    },
    userMessage: {
        padding: 10,
        marginLeft: "auto",
        borderRadius: 16,
        backgroundColor: '#557bf3',
        fontWeight: '500',
        color: '#d9e1fc'
    },
    targetMessage: {
        padding: 10,
        marginRight: 'auto',
        borderRadius: 16,
        backgroundColor: '#DEE5F8',
        fontWeight: '500',
    },
})

export default Conversation;