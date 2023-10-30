import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import useFetch from "../../Services/Hooks/UseFetch";
import { SERVER_ORIGIN_IP, PORT_API } from '@env';

function Login() {
    const [fetchAPI, loading] = useFetch();
    const [email, onChangeEmail] = useState('test@test.fr');
    const [password, onChangePassword] = useState('test');

    const sendCrendentials = () => {
        if(email !== '' && password !== '') {
            fetchAPI({
                url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/login`,
                method: 'POST',
                body: JSON.stringify({email: email, password: password})
            })
            .then(res => res.json())
            .then(data => console.log(data));
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Connexion</Text>
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
                title="Se connecter"
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

export default Login;