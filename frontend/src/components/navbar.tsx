import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  if (isLoading) return <>Loading</>;
  return (
    <nav className="bg-[#F9F9F9] shadow-md h-[72px] p-4 px-6 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to={"/"}
          className="flex justify-center items-center gap-3 w-max "
        >
          <img src="/logo.png" alt="logo" className="h-10 w-auto" />
          <span className="font-semibold text-xl text-accent">Hire Nest</span>
        </Link>
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <Link
              to={"/interview"}
              className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Create Interview
            </Link>
          ) : null}
          {isAuthenticated ? (
            <button onClick={() => logout()} className="font-semibold">
              Logout <span aria-hidden="true">&rarr;</span>
            </button>
          ) : (
            <Link to={"/login"} className="font-semibold">
              Login <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
