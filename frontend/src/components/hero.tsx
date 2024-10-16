import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <>Loading</>;
  return (
    <div className="bg-background min-h-[calc(100vh-72px)] ">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl ">
          <img src="/logo.png" alt="hero" className="h-16 mb-4 mx-auto" />
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              The Smarter Way to Recruit.{" "}
              <a href="#" className="font-semibold text-accent">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Build Your Dream Team with{" "}
              <span className="text-accent">Hire Nest</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Say goodbye to the hassle of hiring. At Hire Nest, we connect you
              with top talent using cutting-edge tools designed to streamline
              your recruitment process. Whether you’re scaling a startup or
              filling key roles, we’re here to help you find the perfect fit.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isAuthenticated ? (
                <Link
                  to={"/interview"}
                  className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Create Interview
                </Link>
              ) : (
                <Link
                  to={"/signup"}
                  className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Get started
                </Link>
              )}
              {isAuthenticated ? (
                <Link
                  to={"/dashboard"}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Dashboard <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <Link
                  to={"#"}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
