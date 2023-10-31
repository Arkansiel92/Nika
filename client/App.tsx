import { socket, socketContext } from './Services/Contexts/Socket/Socket';
import Router from './Router/Router';
import { useAuth } from './Services/Hooks/UseAuth';
import { AuthContext } from './Services/Contexts/Auth/Auth';

export default function App() {
  const { user, login, logout, setUser } = useAuth();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <socketContext.Provider value={socket}>
        <Router />
      </socketContext.Provider>
    </AuthContext.Provider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
