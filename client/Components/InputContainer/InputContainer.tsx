import { useEffect, useState, useContext } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native"
import { socketContext } from "../../Contexts/Socket";
import { AuthContext } from "../../Contexts/Auth";

interface props {
    handleSubmit: (a: string, b: React.Dispatch<React.SetStateAction<string>>) => void
}

function InputContainer({ handleSubmit }: props) {
    const socket = useContext(socketContext);
    const [input, onChangeInput] = useState("");
    const [userWriting, setUserWriting] = useState<Array<String>>([]);
    const { authState } = useContext(AuthContext);

    useEffect(() => {
       input !== "" 
       ? socket.emit('users-writing', true)
       : socket.emit('users-writing', false);

       const setUsersWriting = (users: Array<string>) => {
            setUserWriting(users.filter(u => u !== authState.user?.username));
       }

       socket.on('users-writing', setUsersWriting);

       return () => {
            socket.off('users-writing', setUsersWriting);
       }
    }, [input]);

    return (
        <View style={styles.container}>
            <Text>
                { 
                    userWriting.length >= 2 && userWriting.join(',') + ' sont en train d\'écrire' ||
                    userWriting.length == 1 && userWriting[0] + ' est en train d\'écrire' 
                }
            </Text>
            <View style={styles.containerInput}>
                <TextInput 
                    placeholder="Message..."
                    value={input}
                    onChangeText={onChangeInput}
                    onSubmitEditing={() => handleSubmit(input, onChangeInput)}
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