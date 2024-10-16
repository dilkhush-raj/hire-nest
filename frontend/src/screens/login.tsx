import React, { useState, FormEvent, ChangeEvent } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string;
}

interface AlertProps {
  type: "success" | "error";
  children: React.ReactNode;
}

interface SubmitFeedback {
  type: "success" | "error";
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, children }) => (
  <div
    className={`p-4 mb-4 rounded-md ${
      type === "success"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {children}
  </div>
);

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<SubmitFeedback | null>(
    null
  );
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) {
    navigate("/");
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: a, ...rest } = prev;
        console.log(a);

        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const apiUrl = `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/auth/login`;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitFeedback(null);

    const login = async (email: string, password: string) => {
      try {
        const response = await axios.post(
          apiUrl,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          return { success: true, ...response.data };
        } else {
          return {
            success: false,
            message: response.data.message || "Login failed",
          };
        }
      } catch (error) {
        return { success: false, message: error };
      }
    };

    try {
      const response = await login(formData.email, formData.password);
      if (response.success) {
        setSubmitFeedback({
          type: "success",
          message: "Login successful! Redirecting...",
        });
        setTimeout(() => (window.location.href = "/"), 1000);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      setSubmitFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="my-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="">
            <img
              className="mx-auto h-12 w-auto"
              src="/logo.png"
              alt="Hire Nest"
            />
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
              Log in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">
              Welcome back to Hire Nest
            </p>
          </div>
          <hr className="my-4 " />
          {submitFeedback && (
            <Alert type={submitFeedback.type}>{submitFeedback.message}</Alert>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <Mail />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 outline-none bg-transparent w-full"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <LockKeyhole />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 outline-none bg-transparent w-full"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-accent hover:text-accent-dark"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="rounded-md bg-accent w-full px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-accent hover:text-accent-dark"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
