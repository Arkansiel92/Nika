import { useContext } from 'react';
import { View, Text } from 'react-native'; 
import { AuthContext } from '../../Services/Contexts/Auth/Auth';

function Home() {
    const {user, setUser} = useContext(AuthContext);

    console.log(user);

    return(
        <View>
            <Text>Home screen</Text>
        </View>
    )
}

export default Home;