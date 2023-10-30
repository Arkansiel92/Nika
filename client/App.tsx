import { socket, socketContext } from './Services/Contexts/Socket/Socket';
import Router from './Router/Router';

export default function App() {
  return (
    <socketContext.Provider value={socket}>
      <Router />
    </socketContext.Provider>
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
