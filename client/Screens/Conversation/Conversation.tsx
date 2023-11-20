import { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFetch from "../../Hooks/UseFetch";
import { PORT_API, SERVER_ORIGIN_IP } from "@env";
import { AuthContext } from "../../Contexts/Auth";
import { Message } from "../../Types/Message";
import InputContainer from "../../Components/InputContainer/InputContainer";
import { User } from "../../Types/User";
import { socketContext } from "../../Contexts/Socket";

interface props {
  route: any;
  navigation: any;
}

function Conversation({ route, navigation }: props) {
  const [fetchAPI, loading] = useFetch();
  const [messages, setMessage] = useState<Array<Message>>([]);
  const [target, setTarget] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { targetId } = route.params;
  const { authState } = useContext(AuthContext);
  const socket = useContext(socketContext);
  const scrollRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  const getConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI({
        url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/${authState.user?.id}/messages/${targetId}`,
        method: "GET",
      });
      const data = await response.json();
      if (data.code === 200) {
        // ...
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    input: string,
    onChangeInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (input !== "") {
      await fetchAPI({
        url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/messages/${authState.user?.id}`,
        method: "POST",
        body: JSON.stringify({
          receiver_id: targetId,
          sender_id: authState.user?.id,
          content: input,
        }),
      });

      onChangeInput("");
      socket.emit("get-messages");
      socket.emit("users-writing", false);
    }
  };

  useEffect(() => {
    if (!authState.isAuthenticated) navigation.navigate("Login");

    const setConversation = (id: string) => {
      setConversationId(id);
    };

    const getMessages = async () => {
      await getConversation();
    };

    if (!conversationId) {
      socket.emit("set-conversation", targetId);
    }

    socket.on("set-conversation", setConversation);
    socket.on("get-messages", getMessages);

    getConversation();

    return () => {
      socket.off("set-conversation", setConversation);
      socket.off("get-messages", getMessages);
    };
  }, [socket]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Nom du contact</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        ref={scrollRef}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.type === "sent" ? styles.myBubble : styles.theirBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.type === "sent" ? styles.myMessageText : {},
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
        />
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          // Autres props nécessaires
        />
        <TouchableOpacity>
          <Ionicons name="send" size={24} color="#007aff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: 50,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  theirBubble: {
    backgroundColor: "#ececec",
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007aff",
  },
  messageText: {
    color: "black",
  },
  myMessageText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 5,
    backgroundColor: "white",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    height: 40,
  },
});

export default Conversation;
