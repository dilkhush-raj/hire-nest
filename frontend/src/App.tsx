import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Signup from "./screens/signup";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
