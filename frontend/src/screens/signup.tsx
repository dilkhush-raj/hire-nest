import React, { useState, FormEvent, ChangeEvent } from "react";
import {
  Building2,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  companyName: string;
  employeeCount: string;
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

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    companyName: "",
    employeeCount: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<SubmitFeedback | null>(
    null
  );
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  console.log(isAuthenticated);

  if (isAuthenticated) {
    navigate("/");
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10 digits";
    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.employeeCount.trim())
      newErrors.employeeCount = "Employee count is required";
    else if (
      isNaN(Number(formData.employeeCount)) ||
      parseInt(formData.employeeCount) < 1
    )
      newErrors.employeeCount = "Employee count must be a positive number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            employeeCount: parseInt(formData.employeeCount),
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setSubmitFeedback({
          type: "success",
          message: "Registration successful! Redirecting...",
        });
        setTimeout(() => navigate("/verify"), 2000);
      } else {
        throw new Error(data.message || "Registration failed");
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
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">
              Join Hire Nest and start building your dream team.
            </p>
          </div>
          <hr className="my-4 " />
          {submitFeedback && (
            <Alert type={submitFeedback.type}>{submitFeedback.message}</Alert>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <UserRound />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 outline-none bg-transparent w-full"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}

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

            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <Phone />
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="mt-1 outline-none bg-transparent w-full"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}

            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <Building2 />
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="mt-1 outline-none bg-transparent w-full"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            {errors.companyName && (
              <p className="text-red-500 text-xs">{errors.companyName}</p>
            )}

            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <Users />
              <input
                type="text"
                name="employeeCount"
                id="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent w-full"
                placeholder="Employee Count"
              />
            </div>
            {errors.employeeCount && (
              <p className="text-red-500 text-xs">{errors.employeeCount}</p>
            )}

            <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">
              By clicking on proceed you will accept our <br />
              <Link to="/terms" className="text-accent">
                Terms
              </Link>{" "}
              &{" "}
              <Link to="/conditions" className="text-accent">
                Conditions
              </Link>
            </p>

            <div>
              <button
                type="submit"
                className="rounded-md bg-accent w-full px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Proceed"}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don you have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-accent hover:text-accent-dark"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
