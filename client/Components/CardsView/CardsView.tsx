import { ScrollView, StyleSheet } from "react-native";
import { Conversation } from "../../Types/Conversation";
import Card from "../Card/Card";
import { useContext } from "react";
import { AuthContext } from "../../Services/Contexts/Auth/Auth";

interface props {
    data: Array<Conversation>
}

function CardsView({ data }: props) {
    const { authState } = useContext(AuthContext);

    return (
        <ScrollView style={styles.container}>
            {data.map((d, index: number) => {
                if(authState.user?.id !== d.id && authState.user?.username !== d.username) {
                    return <Card 
                        key={index} 
                        id={d.id} 
                        title={d.username}
                        lastMessage={d.content}
                        publishedAt={d.published_at}
                    />
                }
            })}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    }
})

export default CardsView;