import { useEffect, useContext, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import useFetch from "../../Hooks/UseFetch";
import { PORT_API, SERVER_ORIGIN_IP } from "@env";
import { AuthContext } from "../../Contexts/Auth";
import { Message } from "../../Types/Message";
import InputContainer from "../../Components/InputContainer/InputContainer";
import { User } from "../../Types/User";
import { socketContext } from "../../Contexts/Socket";

interface props {
    route: any
    navigation: any
}

function Conversation({ route, navigation }: props) {
    const [fetchAPI, loading] = useFetch();
    const [messages, setMessage] = useState<Array<Message>>([]);
    const [target, setTarget] = useState<User | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { targetId } = route.params;
    const { authState } = useContext(AuthContext);
    const socket = useContext(socketContext);

    const getConversation = async () => {
        await fetchAPI({
            url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/messages/${targetId}`,
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                setMessage(data.data);
                if(!target) setTarget(data.target);
            }
        });
    }

    const handleSubmit = (input: string, onChangeInput: React.Dispatch<React.SetStateAction<string>>) => {
        if(input !== "") {
            fetchAPI({
                url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/messages`,
                method: 'POST',
                body: JSON.stringify({
                    receiver_id: targetId,
                    sender_id: authState.user?.id,
                    content: input
                })
            })
            .then(res => res.json())
            .then(data => setMessage(data.data));
            
            onChangeInput('');
        }
    }

    useEffect(() => {
        if(!authState.isAuthenticated) navigation.navigate('Login');
        
        const setConversation = (id: string) => {
            setConversationId(id);
        }
        
        if(!conversationId) {   
            socket.emit('set-conversation', targetId);
        };

        socket.on('set-conversation', setConversation);
        socket.on('get-messages', getConversation);
        
        getConversation();

        return () => {
            socket.off('set-conversation', setConversation);
            socket.off('get-messages', getConversation);
        }
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
            <InputContainer handleSubmit={handleSubmit} />
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