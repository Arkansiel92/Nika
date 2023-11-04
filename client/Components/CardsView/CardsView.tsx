import { ScrollView, View, StyleSheet } from "react-native";
import { Conversation } from "../../Types/Conversation";
import Card from "../Card/Card";

interface props {
    data: Array<Conversation>
}

function CardsView({ data }: props) {
    return (
        <ScrollView style={styles.container}>
            {data.map((d, index: number) => (
                <Card 
                    key={index} 
                    id={d.id} 
                    title={d.username}
                    lastMessage={d.content}
                    publishedAt={d.published_at}
                />
            ))}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    }
})

export default CardsView;