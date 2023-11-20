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
import { socketContext } from "../../Contexts/Socket";
import { User } from "../../Types/User";
import * as ImagePicker from "expo-image-picker";


interface props {
  route: any;
  navigation: any;
}

interface Message {
  id: string;
  text: string;
  type: string;
  sender_id?: number;
  receiver_id?: number;
  content?: string;
  published_at?: Date;
}

function Conversation({ route, navigation }: props) {
  const [fetchAPI, loading] = useFetch();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [target, setTarget] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { targetId } = route.params;
  const { authState } = useContext(AuthContext);
  const socket = useContext(socketContext);
  const scrollRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageInput, onChangeInput] = useState("");
  const [userWriting, setUserWriting] = useState<Array<String>>([]);

  const getConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchAPI({
        url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/api/${authState.user?.id}/messages/${targetId}`,
        method: "GET",
      });

      const data = await response.json();
      if (data.code === 200) {
        setMessages(data.data);
        if (!target) setTarget(data.target);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const uri = (result as any).uri;
    if (!result.canceled && uri) {
    }
  };

  const handleSubmit = async () => {
    if (messageInput !== "") {
      await fetchAPI({
        url: `http://${SERVER_ORIGIN_IP}:${PORT_API}/api/messages/${authState.user?.id}`,
        method: "POST",
        body: JSON.stringify({
          receiver_id: targetId,
          sender_id: authState.user?.id,
          content: messageInput,
        }),
      });

    const uri = (result as any).uri;
    if (!result.canceled && uri) {
    }
  };

  const getRandomResponse = () => {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex].text;
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = () => {
    if (messageInput.trim() !== "") {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput,
        type: "sent",
        sender_id: authState.user?.id, // Or some default value
        receiver_id: targetId, // Or some default value
        content: messageInput,
        published_at: new Date(),
      };

      setMessage((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
      scrollToBottom();

      setTimeout(() => {
        setMessage((prevMessages) => [
          ...prevMessages,
          {
            id: (Date.now() + 1).toString(),
            text: getRandomResponse(),
            type: "received",
            sender_id: targetId, // Or some default value
            receiver_id: authState.user?.id, // Or some default value
            content: getRandomResponse(),
            published_at: new Date(),
          },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!authState.isAuthenticated) navigation.navigate("Login");

    messageInput !== ""
      ? socket.emit("users-writing", true)
      : socket.emit("users-writing", false);

    const setConversation = (id: string) => {
      setConversationId(id);
    };

    const getMessages = async () => {
      await getConversation();
    };

    const setUsersWriting = (users: Array<string>) => {
      setUserWriting(users.filter((u) => u !== authState.user?.username));
    };

    if (!conversationId) {
      socket.emit("set-conversation", targetId);
    }

    socket.on("users-writing", setUsersWriting);
    socket.on("set-conversation", setConversation);
    socket.on("get-messages", getMessages);

    getConversation();

    return () => {
      socket.off("set-conversation", setConversation);
      socket.off("get-messages", getMessages);
      socket.off("users-writing", setUsersWriting);
    };
  }, [socket, messageInput]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{target?.username}</Text>
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
                item.receiver_id !== authState.user.id
                  ? styles.myBubble
                  : styles.theirBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.receiver_id !== authState.user.id
                    ? styles.myMessageText
                    : {},
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>

      <Text style={{ marginLeft: 10 }}>
        {
          (userWriting.length >= 2 && userWriting.join(",") + " sont en train d'écrire...") ||
          (userWriting.length == 1 && userWriting[0] + " est en train d'écrire...")
        }
      </Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="camera" size={24} color="#007aff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={messageInput}
          onChangeText={setMessageInput}
        />
        <TouchableOpacity onPress={handleSend}>
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
    marginBottom: 36,
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
