import { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import useFetch from '../../Hooks/UseFetch';
import { PORT_API, SERVER_ORIGIN_IP } from '@env';
import { AuthContext } from '../../Contexts/Auth';
import { socketContext } from '../../Contexts/Socket';

interface props {
    navigation: any
}

function Groups({ navigation }: props) {
    const [fetchAPI, loading] = useFetch();
    const { authState } = useContext(AuthContext);
    const socket = useContext(socketContext);
    const [groups, setGroups] = useState([]);

    const getGroups = async () => {
        await fetchAPI({
            url : `http://${SERVER_ORIGIN_IP}:${PORT_API}/api/groups/${authState.user?.id}`,
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setGroups(data.data);
        });
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            socket.emit('remove-room', null);
            await getGroups();
        });
        return unsubscribe;

    }, [groups])

    return(
        <View style={styles.container}>
            <ScrollView>
                {
                    groups.length === 0
                    ? <Text>Vous n'êtes dans aucun groupe. Vous n'avez pas d'amis</Text>
                    : groups.map(() => (
                        
                    ))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff'
    },
})
export default Groups;