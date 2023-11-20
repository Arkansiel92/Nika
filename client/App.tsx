import { socket, socketContext } from './Contexts/Socket';
import Router from './Router/Router';
import { AuthProvider } from './Provider/AuthProvider';

export default function App() {

  return (
    <AuthProvider>
      <socketContext.Provider value={socket}>
        <Router />
      </socketContext.Provider>
    </AuthProvider>
  );
}
