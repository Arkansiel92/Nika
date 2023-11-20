import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../Contexts/Auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import Register from "../Screens/Register/Register";
import Login from "../Screens/Login/Login";
import Home from "../Screens/Home/Home";
import Profile from "../Screens/Profile/Profile";
import Logout from "../Screens/Logout/Logout";
import Groups from "../Screens/Groups/Groups";
import Conversation from "../Screens/Conversation/Conversation";

function IsAuthenticated() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Groups") {
            iconName = focused ? "people-sharp" : "people-outline";
          } else if (route.name === "Profile") {
            iconName = focused
              ? "person-circle-sharp"
              : "person-circle-outline";
          } else if (route.name === "Logout") {
            iconName = "exit-outline";
            color = "red";
          } else if (route.name === "Register") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Login") {
            iconName = focused
              ? "person-circle-sharp"
              : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: "Messages" }}
      />
      <Tab.Screen
        name="Groups"
        component={Groups}
        options={{ title: "Groupes" }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Mon profil" }}
      />
      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{ title: "Deconnexion" }}
      />
    </Tab.Navigator>
  );
}

function Router() {
  const Stack = createNativeStackNavigator();
  const { authState } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState.isAuthenticated ? (
          <>
            <Stack.Screen
              name="IsAuthenticated"
              component={IsAuthenticated}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Conversation" component={Conversation} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: "Connexion" }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ title: "Créer un compte" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// function Router() {
//     const Tab = createBottomTabNavigator();

//     const { authState } = useContext(AuthContext);

//     return (
//         <NavigationContainer>
//             <Tab.Navigator
//                 screenOptions={({ route }) => ({
//                     tabBarIcon: ({ focused, color, size }) => {
//                         let iconName = '';

//                         if (route.name === 'Home') {
//                             iconName = focused
//                                 ? 'chatbubble-ellipses'
//                                 : 'chatbubble-ellipses-outline'
//                         } else if (route.name === 'Groups') {
//                             iconName = focused
//                                 ? 'people-sharp'
//                                 : 'people-outline'
//                         } else if (route.name === 'Profile') {
//                             iconName = focused
//                                 ? 'person-circle-sharp'
//                                 : 'person-circle-outline'
//                         } else if (route.name === 'Logout') {
//                             iconName = 'exit-outline'
//                             color = 'red'
//                         } else if (route.name === 'Register') {
//                             iconName = focused
//                                 ? 'add-circle'
//                                 : 'add-circle-outline'
//                         } else if (route.name === 'Login') {
//                             iconName = focused
//                                 ? 'person-circle-sharp'
//                                 : 'person-circle-outline'
//                         }

//                         return <Ionicons name={iconName} size={size} color={color} />
//                     }
//                 })}
//             >
//                 {
//                     authState.isAuthenticated ? (
//                         <>
//                             <Tab.Screen
//                                 name='Home'
//                                 component={Home}
//                                 options={{ title: "Messages" }}
//                             />
//                             <Tab.Screen
//                                 name="Groups"
//                                 component={Groups}
//                                 options={{ title: 'Groupes' }}
//                             />
//                             <Tab.Screen
//                                 name='Profile'
//                                 component={Profile}
//                                 options={{ title: "Mon profil" }}
//                             />
//                             <Tab.Screen
//                                 name='Logout'
//                                 component={Logout}
//                                 options={{ title: "Deconnexion" }}
//                             />
//                         </>
//                     ) : (
//                         <>
//                             <Tab.Screen
//                                 name='Login'
//                                 component={Login}
//                                 options={{ title: "Se connecter" }}
//                             />
//                             <Tab.Screen
//                                 name='Register'
//                                 component={Register}
//                                 options={{ title: "Créer un compte" }}
//                             />
//                         </>
//                     )
//                 }
//             </Tab.Navigator>
//         </NavigationContainer>
//     )
// };

export default Router;
