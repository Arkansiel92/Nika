import { useState, useContext } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import useFetch from "../../Hooks/UseFetch";
import { SERVER_ORIGIN_IP, PORT_API } from '@env';
import { AuthContext } from "../../Contexts/Auth";

function Login({ navigation }: any) {
    const [fetchAPI, loading] = useFetch();
    const { login } = useContext(AuthContext);
    const [email, onChangeEmail] = useState('test@test.fr');
    const [password, onChangePassword] = useState('test');

    const sendCrendentials = async () => {
        if(email !== '' && password !== '') {
            const res = await fetchAPI({
                url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/api/auth`,
                method: 'POST',
                body: JSON.stringify({email: email, password: password})
            })
            .then(res => res.json())
            .then(data => data);

            if(res.code === 200) {
                try {
                    login(res._token);
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log(res.msg);
            }
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Se connecter</Text>
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
            <View style={styles.styleLoginBtn}>
                <Button
                    color="#3E96F4"
                    title="Se connecter"
                    onPress={sendCrendentials}
                />
            </View>

            <View style={{ marginTop: 30 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                    <Text>Vous n'avez pas de compte ?</Text>
                    <View style={styles.styleLoginBtn}>
                        <Button
                            color="#3E96F4"
                            title="Créer un compte !"
                            onPress={() => navigation.navigate("Register")}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 250,
        margin: 12,
        padding: 10,
        borderBottomWidth: 1
    },
    styleLoginBtn: {
        marginLeft: 50,
        marginRight: 50,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
      },
});

export default Login;