import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="h-8 w-auto invert hue-rotate-180"
          />
          <span className="font-semibold text-lg text-accent">Hire Nest</span>
        </div>
        <div className="flex gap-2">
          Developer by
          <Link
            to={"https://dilkhushraj.me"}
            target="_blank"
            className="text-accent"
          >
            Dilkhush Raj
          </Link>
        </div>
        <div className=" text-center text-sm">
          &copy; {new Date().getFullYear()} Hire Nest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
