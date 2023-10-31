import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import useFetch from "../../Services/Hooks/UseFetch";
import { SERVER_ORIGIN_IP, PORT_API } from '@env';
import { useAsyncStorage } from "../../Services/Hooks/UseAsyncStorage";
import { useAuth } from "../../Services/Hooks/UseAuth";

function Login({ navigation }: any) {
    const [fetchAPI, loading] = useFetch();
    const { login } = useAuth();
    const [email, onChangeEmail] = useState('test@test.fr');
    const [password, onChangePassword] = useState('test');

    const sendCrendentials = async () => {
        if(email !== '' && password !== '') {
            const res = await fetchAPI({
                url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/login`,
                method: 'POST',
                body: JSON.stringify({email: email, password: password})
            })
            .then(res => res.json())
            .then(data => data);

            console.log(res);
            
            if(res.code === 200) {
                try {
                    login(res._token);

                    navigation.navigate('Home');
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log(res.msg);
            }
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