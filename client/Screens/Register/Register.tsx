import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import useFetch from "../../Services/Hooks/UseFetch";
import { SERVER_ORIGIN_IP, PORT_API } from '@env';

function Register() {
    const [fetchAPI, loading] = useFetch();
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');

    const sendCrendentials = () => {
        if(email !== '' && password !== '') {
            const res = fetchAPI({
                url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/user/login`,
                method: 'POST',
                body: JSON.stringify({email: email, password: password})
            })
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Créer un compte</Text>
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