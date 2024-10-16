import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Signup from "./screens/signup";
import Hero from "./components/hero";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./screens/login";
import JobPostingForm from "./screens/interview";
import Footer from "./components/footer";
import Verify from "./screens/verify";
import { useEffect } from "react";
import Dashboard from "./screens/dashboard";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (!user?.emailVerified) {
        navigate("/verify");
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) return <div>Loading...</div>;

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Hero />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interview" element={<JobPostingForm />} />
              <Route path="/verify" element={<Verify />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
