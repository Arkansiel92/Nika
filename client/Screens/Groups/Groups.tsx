import { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import useFetch from "../../Hooks/UseFetch";
import { PORT_API, SERVER_ORIGIN_IP } from "@env";
import { AuthContext } from "../../Contexts/Auth";
import { socketContext } from "../../Contexts/Socket";
import { Group } from "../../Types/Group";

interface props {
  navigation: any;
}

function Groups({ navigation }: props) {
  const [fetchAPI, loading] = useFetch();
  const { authState } = useContext(AuthContext);
  const socket = useContext(socketContext);
  const [groups, setGroups] = useState<Array<Group>>([]);

  const getGroups = async () => {
    await fetchAPI({
      url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/api/groups/${authState.user?.id}`,
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGroups(data.data);
      });
  };

  const handleSelectGroup = (id: number) => {};

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      socket.emit("remove-room", null);
      await getGroups();
    });
    return unsubscribe;
  }, [groups]);

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Group }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleSelectGroup(item.id)}
          >
            <View style={styles.textContainer}>
              <Image
                style={{ borderRadius: 90 }}
                source={{
                  uri: `https://picsum.photos/${getRandomInt(100)}/80`,
                }}
                width={80}
                height={80}
              />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffff",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default Groups;
