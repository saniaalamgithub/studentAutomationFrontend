import LoginPage from "./page/LoginPage";
import NewUserPage from "./page/NewUserPage";
import AdminHomePage from "./page/Home/AdminHomePage";
import StudentHomePage from "./page/Home/StudentHomePage";
import TeacherHomePage from "./page/Home/TeacherHomePage";
import GuardianHomePage from "./page/Home/GuardianHomePage";
import CommonErrorPage from "./page/Error/CommonErrorPage"
import GuardianRegisterPage from "./page/Register/GuardianRegisterPage";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/regi" element={<NewUserPage />} />
      <Route path="/guardian" element={<GuardianHomePage />} />
      <Route path="/guardian/create" element={<GuardianRegisterPage />} />
      <Route path="/student" element={<StudentHomePage />} />
      <Route path="/admin" element={<AdminHomePage />} />
      <Route path="/teacher" element={<TeacherHomePage />} />
      <Route path="/error" element={<CommonErrorPage />} />
    </Routes>
  );
}

export default App;
