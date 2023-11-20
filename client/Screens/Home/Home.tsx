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
import CardsView from "../../Components/CardsView/CardsView";
import { Conversation } from "../../Types/Conversation";
import { socketContext } from "../../Contexts/Socket";

interface props {
  navigation: any;
}

function Home({ navigation }: props) {
  const { authState } = useContext(AuthContext);
  const socket = useContext(socketContext);
  const [fetchAPI, loading] = useFetch();
  const [conversations, setConversations] = useState<Array<Conversation>>([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const [users, setUsers] = useState([
    { id: "1", name: "Alice", profilePic: "https://example.com/alice.jpg" },
    { id: "2", name: "Bob", profilePic: "https://example.com/bob.jpg" },
    { id: "3", name: "Charlie", profilePic: "https://example.com/charlie.jpg" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConversations = async () => {
    await fetchAPI({
      url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/users/conversations`,
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setConversations(data.data);
        }
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
  };

  useEffect(() => {
    if (!authState.isAuthenticated) navigation.navigate("Login");

    getConversations();

    const unsubscribe = navigation.addListener("focus", () =>
      socket.emit("remove-room", null)
    );
    return unsubscribe;
  }, [authState, navigation]);

  return (
    <View>
      {/* Affichage des conversations existantes */}
      {conversations.length === 0 ? (
        <Text>Aucun messages, vous n'avez pas d'amis.</Text>
      ) : (
        <CardsView data={conversations} />
      )}

      {/* Bouton pour ajouter une conversation */}
      <Button title="+" onPress={handleAddConversation} />

      {/* Liste des utilisateurs pour démarrer une nouvelle conversation */}
      {showUsersList && (
        <View>
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectUser(item.id)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item.profilePic }}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                  />
                  <Text>{item.name}</Text>
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
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    margin: 10,
  },
});

export default Home;
