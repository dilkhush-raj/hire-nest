import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Signup from "./screens/signup";
import Hero from "./components/hero";
import { AuthProvider } from "./context/AuthContext";
import Login from "./screens/login";
import JobPostingForm from "./screens/interview";
import Footer from "./components/footer";
import Verify from "./screens/verify";

const Layout = () => {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Outlet />
        <Footer />
      </AuthProvider>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Hero />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/interview" element={<JobPostingForm />} />
          <Route path="/verify" element={<Verify />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
