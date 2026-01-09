import { useState } from "react";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return isAuth ? (
    <Tasks />
  ) : (
    <Login onLogin={() => setIsAuth(true)} />
  );
}

export default App;
