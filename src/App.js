import LoginPage from "./page/LoginPage";
import HomePageAdmin from "./page/HomePageAdmin";
import NewUserPage from "./page/NewUserPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePageAdmin />} />
      <Route path="/regi" element={<NewUserPage />} />
    </Routes>
  );
}

export default App;
