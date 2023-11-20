import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../Contexts/Auth";
import useFetch from "../../Hooks/UseFetch";
import { SERVER_ORIGIN_IP, PORT_API } from "@env";
import { Conversation } from "../../Types/Conversation";
import { socketContext } from "../../Contexts/Socket";
import { User } from "../../Types/User";

interface props {
  navigation: any;
}

function Home({ navigation }: props) {
  const { authState } = useContext(AuthContext);
  const socket = useContext(socketContext);
  const [fetchAPI, loading] = useFetch();
  const [conversations, setConversations] = useState<Array<Conversation>>([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [users, setUsers] = useState<Array<User>>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectConversation = (userId: any) => {
    navigation.navigate("Conversation", { targetId: userId });
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) && user.username !== authState.user.username
  );

  const getConversations = async () => {
    await fetchAPI({
      url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/api/messages/${authState.user?.id}`,
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setConversations(data.data.filter((c: Conversation) => c.username !== authState.user.username));
        }
      });
  };

  const getUsers = async () => {
    await fetchAPI({
      url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/api/users`,
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
      });
  };

  const handleAddConversation = () => {
    setShowUsersList(true);
  };

  const handleCloseUsersList = () => {
    setShowUsersList(false);
  };

  const handleSelectUser = (userId: any) => {
    setShowUsersList(false);
    navigation.navigate("Conversation", { targetId: userId });
  };

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectConversation(item.id)}
    >
      <Image
        style={{ borderRadius: 90 }}
        source={{ uri: `https://picsum.photos/${getRandomInt(100)}/80` }}
        width={80}
        height={80}
      />
      <Text>{item.username}</Text>
      <Text>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (!authState.isAuthenticated) navigation.navigate("Login");

    getConversations();
    getUsers();

    const unsubscribe = navigation.addListener("focus", () =>
      socket.emit("remove-room", null)
    );
    return unsubscribe;
  }, [authState, navigation]);

  return (
    <View style={styles.container}>
      {/* Affichage des conversations existantes */}
      {conversations.length === 0 ? (
        <Text style={styles.noConversationsText}>
          Aucun message, vous n'avez pas d'amis.
        </Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Conversation }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => handleSelectConversation(item.id)}
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
                  <Text style={styles.userName}>{item.username}</Text>
                  <Text style={styles.lastMessage}>{item.content}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bouton pour ajouter une conversation */}
      <View style={styles.addButtonContainer}>
        <Button title="+" onPress={handleAddConversation} />
      </View>

      {/* Liste des utilisateurs pour démarrer une nouvelle conversation */}
      {showUsersList && (
        <View style={styles.usersListContainer}>
          {/* Barre de recherche pour filtrer les utilisateurs */}
          <TextInput
            style={styles.searchBar}
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Liste des utilisateurs filtrés */}
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectUser(item.id)}>
                <View style={styles.userItem}>
                  <Text style={styles.userName}>{item.username}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Bouton pour fermer la liste des utilisateurs */}
          <Button title="Fermer" onPress={handleCloseUsersList} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  noConversationsText: {
    textAlign: "center",
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flexDirection: 'row',
    marginVertical: 15
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
  },
  addButtonContainer: {
    margin: 10,
  },
  usersListContainer: {
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    margin: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});

export default Home;
