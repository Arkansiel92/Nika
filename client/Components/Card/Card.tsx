import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from "react-native";

interface props {
    id: number
    title: string
    lastMessage: string
    publishedAt: string
}

function Card({id, title, lastMessage, publishedAt}: props) {
    const navigation = useNavigation<any>();

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    }

    const getConversation = () => {
        navigation.navigate('Conversation', {
            targetId: id
        });
    }

    return(
        <View style={styles.container}>
            <Image
                style={styles.img}
                source={{uri: `https://picsum.photos/${getRandomInt(100)}/80`}} 
                width={80}
                height={80}
            />
            <TouchableWithoutFeedback onPress={getConversation}>
                <View style={styles.containerText}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={{ color: 'grey' }}>{ new Date(publishedAt).toLocaleDateString('fr') }</Text>
                    </View>
                    <Text style={ {color: 'grey'} }>{ lastMessage.length > 50 ? lastMessage.substring(0, 100) + "..." : lastMessage }</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 15
    },
    img: {
        borderRadius: 90,
    },
    containerText: {
        paddingHorizontal: 10,
        flex: 1
    },
    containerTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    }
})

export default Card;