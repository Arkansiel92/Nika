import { useEffect, useState, useContext } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native"
import { socketContext } from "../../Services/Contexts/Socket/Socket";
import useFetch from "../../Services/Hooks/UseFetch";
import { PORT_API, SERVER_ORIGIN_IP } from "@env";

interface props {
    receiverId: number | undefined
    senderId: number | undefined
}

function InputContainer({ receiverId, senderId }: props) {
    const socket = useContext(socketContext);
    const [fetchAPI, loading] = useFetch();
    const [input, onChangeInput] = useState("");
    const [userWriting, setUserWriting] = useState<Array<String>>([]);

    const handleSubmit = () => {
        if(input !== "") {
            fetchAPI({
                url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/messages`,
                method: 'POST',
                body: JSON.stringify({
                    receiver_id: receiverId,
                    sender_id: senderId,
                    content: input
                })
            })
            onChangeInput('');
        }
    }

    useEffect(() => {
       if(input !== "") {
            console.log('utilisateur en train d\'écrire');
        
            socket.emit('userWriting', {room: '', value: true});
       } else {
            console.log('utilisateur a fini d\'écrire');

            socket.emit('userWriting', {room: '', value: false});
       }
    }, [input]);

    return (
        <View style={styles.container}>
            <Text>
                { 
                    userWriting.length >= 2 && userWriting.join(',') + ' sont en train d\'écrire' 
                }
                {
                    userWriting.length == 1 && userWriting[0] + ' est en train d\'écrire' 
                }
            </Text>
            <View style={styles.containerInput}>
                <TextInput 
                    placeholder="Message..."
                    value={input}
                    onChangeText={onChangeInput}
                    onSubmitEditing={handleSubmit}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    containerInput: {
        padding: 12,
        borderRadius: 32,
        backgroundColor: '#DEE5F8',
    }
})

export default InputContainer;