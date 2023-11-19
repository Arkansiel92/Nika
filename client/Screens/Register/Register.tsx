import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import useFetch from "../../Hooks/UseFetch";
import { SERVER_ORIGIN_IP, PORT_API } from '@env';

function Register() {
    const [fetchAPI, loading] = useFetch();
    const [username, onChangeUsername] = useState('Test');
    const [email, onChangeEmail] = useState('test@test.fr');
    const [password, onChangePassword] = useState('test');

    const sendCrendentials = async () => {
        if (email !== '' && password !== '' && username !== '') {
            const res = await fetchAPI({
                url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/register`,
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
                .then(res => res.json())
                .then(data => console.log(data));
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Créer un compte</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={onChangeUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={onChangeEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                secureTextEntry={true}
                onChangeText={onChangePassword}
            />
            <Button
                title="Créer mon compte"
                onPress={sendCrendentials}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 250,
        margin: 12,
        borderWidth: 1,
        borderRadius: 16,
        padding: 10,
    }
});

export default Register;