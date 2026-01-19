import { AuthProvider } from "./auth/AuthContext";
import AppRouter from "./router/AppRouter";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
