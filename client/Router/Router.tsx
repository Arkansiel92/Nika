import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from "../Screens/Register/Register";


function Router() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Register" 
                    component={Register} 
                    options={{title: "Créer un compte"}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default Router;